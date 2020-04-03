import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';

import api from '../../services/api';
import AlignmentBinaryFile from '../../services/masa-viewer/AlignmentBinaryFile';
import SequenceData from '../../services/masa-viewer/SequenceData';
import TextChunk from '../../services/masa-viewer/TextChunk';
import TextChunkSum from '../../services/masa-viewer/TextChunkSum';

import ChartOptions from './functions/ChartOptions';
import binSearch from './functions/binSerach';

import './styles.scss';

export default class ShowAlignment extends Component {
    static alignment  = 0x0001;
    static binFiles   = 0x0002;
    static fastaFiles = 0x0004;
    timeOut = 0;

    alignment    = null;
    textChunkSum = null;
    sequences    = null;
    resetValues  = null;

    min = 0;
    max = 0;

    constructor(props){
        super(props);

        this.state = {
            _id: null,
            chunks: null,
            description: null,
            alignmentInfo: null,
            xAxis: null,
            yAxis: null,
            range: null,
            render: true,
            errors: 0x0000,
        };
    }

    isAlignmentReady = async () => {
        const { s0, s1 } = this.state.alignmentInfo;
        const { data: { isReady } } = await api.get(`/isAlignmentReady?s0=${ s0 }&s1=${ s1 }`);

        if(isReady === true){
            await this.renderResults();
        } else {
            this.timeOut += 5000;
            setTimeout(this.isAlignmentReady, this.timeOut);
        }
    }

    async componentDidMount() {
        try {
            const { data } = await api.get(`/alignments/${ this.props.match.params.id }`);

            this.setState({
                _id: data._id,
                alignmentInfo: data
            })

            await this.isAlignmentReady();
        } catch (err) {
            this.setState({
                render: false,
                errors: this.state.errors | ShowAlignment.alignment
            })
        }
    }

    renderResults = async () => {
        await this.buildResults();
        await this.buildTextResults();

        const s0gapped = this.alignment.getAlignmentWithGaps(0).getSB();
        const s1gapped = this.alignment.getAlignmentWithGaps(1).getSB();
        
        const xAxis = [];
        const yAxis = [];
        for(var i = 0, 
                x = this.alignment.getSequenceStartPosition(0),
                y = this.alignment.getSequenceStartPosition(1); i < s0gapped.length; i++){
            if(s0gapped[i] === s1gapped[i]){
                xAxis.push(x++);
                yAxis.push(y++);
            } else {
                if(s0gapped[i] !== '-' && s1gapped[i] !== '-'){
                    xAxis.push(x++);
                    yAxis.push(y++);
                } else if (s0gapped[i] === '-'){
                    xAxis.push(x);
                    yAxis.push(y++);
                } else {
                    xAxis.push(x++);
                    yAxis.push(y);
                }
            }
        }

        this.setState({
            xAxis: xAxis,
            yAxis: yAxis,
            range: s0gapped.length
        });
    }

    buildResults = async () => {
        try{
            const { data: { data } } = await api.get(`/bin/${this.state._id}`);
            const buff = new Buffer(data);

            this.alignment = AlignmentBinaryFile.read(buff);
            this.sequences = this.alignment.getAlignmentParams().getSequences();

            const description = [];
            description.push(this.alignment.getAlignmentParams().getSequence(0).getInfo().getDescription());
            description.push(this.alignment.getAlignmentParams().getSequence(1).getInfo().getDescription());
            
            if(this.resetValues === null)
                this.resetValues = [this.alignment.getSequenceStartPosition(0), this.alignment.getSequenceEndPosition(0)];

            this.setState({ description });
        } catch (err) {
            console.log(err);
            this.setState({
                render: false,
                errors: this.state.errors | ShowAlignment.binFiles
            });
        }
    }

    buildTextResults = async () => {
        try {
            const { data: { s0file, s1file }} = await api.get(`/fasta/${this.state._id}`);
            this.sequences[0].setData(new SequenceData({ file: s0file, modifiers: this.sequences[0].getModifiers() }));
            this.sequences[1].setData(new SequenceData({ file: s1file, modifiers: this.sequences[1].getModifiers() }));

            if(this.alignment !== undefined && this.alignment.getAlignmentParams().getSequence(0).getData() !== undefined &&
                this.alignment.getAlignmentParams().getSequence(1).getData() !== undefined){
                    
                this.alignment.getAlignmentWithGaps(0).reset(this.alignment.getSequenceStartOffset(0), this.alignment.getSequenceEndOffset(0));
                this.alignment.getAlignmentWithGaps(1).reset(this.alignment.getSequenceStartOffset(1), this.alignment.getSequenceEndOffset(1));
                this.textChunkSum = new TextChunkSum(
                    this.alignment.getAlignmentParams().getMatch(),
                    this.alignment.getAlignmentParams().getMismatch(),
                    this.alignment.getAlignmentParams().getGapOpen(),
                    this.alignment.getAlignmentParams().getGapExtension()
                );


                var chunks = [];
                while(this.hasMoreChunks()) {
                    let chunk = this.getNextChunk(60);
                    chunks.push(chunk.getHTMLString());
                }

                chunks.push(this.textChunkSum.getHTMLString());
            }

            this.setState({ 
                chunks,
                min: this.alignment.getSequenceStartPosition(0),
                max: this.alignment.getSequenceEndPosition(0)
            });
            console.log(this.alignment);
        } catch (err) {
            this.setState({
                render: false,
                errors: this.state.errors + ShowAlignment.fastaFiles
            });
        }
    }

    getSeq0WithGaps = () => {
        return this.alignment.getAlignmentWithGaps(0);
    }
    
    getSeq1WithGaps= () => {
        return this.alignment.getAlignmentWithGaps(1);
    }
    
    hasMoreChunks = () => {
        return(!this.alignment.getAlignmentWithGaps(0).isDone() && !this.alignment.getAlignmentWithGaps(1).isDone());
    }
    
    getNextChunk = (cols) => {
        let chunk = new TextChunk();
        
        if(this.hasMoreChunks()){
            chunk.setStartPositions(this.getSeq0WithGaps().getCurrentPosition(),
                this.getSeq1WithGaps().getCurrentPosition());
    
            let chunk0 = this.getSeq0WithGaps().getNextChunk(cols);
            let chunk1 = this.getSeq1WithGaps().getNextChunk(cols);
    
            chunk.setEndPositions(this.getSeq0WithGaps().getCurrentPosition(),
                this.getSeq1WithGaps().getCurrentPosition());
    
            chunk.setChunks(chunk0, chunk1);
    
            let chunkScore = this.textChunkSum.sumChunk(chunk);
            chunk.setSuffix(`[${chunkScore}]/[${this.textChunkSum.getScore()}]`);
        }
    
        return chunk;
    }

    adjustTextResults = (event, reset) => {
        event.preventDefault();

        this.setState({ chunks: null });

        setTimeout(() => {
            let xRange = reset === false ? 
                [this.min, this.max] :
                [...this.resetValues];

            if(xRange[0] > xRange[1]) { xRange[0] = xRange[1]; }

            let [x0, x0Coord] = binSearch(this.state.xAxis, xRange[0]);
            let [x1, x1Coord] = binSearch(this.state.xAxis, xRange[1], false);

            let y0 = this.state.yAxis[x0Coord];
            let y1 = this.state.yAxis[x1Coord];

            let offsetY0 = this.alignment.getSequenceOffset(1, y0);
            let offsetY1 = this.alignment.getSequenceOffset(1, y1) + 1;
            let offsetX0 = this.alignment.getSequenceOffset(0, x0);
            let offsetX1 = this.alignment.getSequenceOffset(0, x1) + 1;

            let tmp;
            if(offsetX0 > offsetX1){
                tmp = offsetX0;
                offsetX0 = offsetX1;
                offsetX1 = tmp;
            }
            if(offsetY0 > offsetY1){
                tmp = offsetY0;
                offsetY0 = offsetY1;
                offsetY1 = tmp;
            }
            
            let offset0 = Math.max(offsetY0, offsetX0);
            let offset1 = Math.max(offsetY1, offsetX1);
            
            if(offset0 < 0)
                offset0 = 0;
            if(offset1 < 0)
                offset1 = 0;

            this.alignment = this.alignment.truncate(offset0, offset1);
            this.buildTextResults();
        }, 500);
    }

    htmlDecode = () => {
        if(this.state.chunks !== null){
            document.querySelector('.alignmentText').style = 'display: block';

            let div = document.createElement('div');
            div.innerHTML = '';
            
            let stringChunks = '';
            this.state.chunks.forEach(chunk => {
                stringChunks += chunk + '<br>';
            });

            return div.innerHTML = stringChunks;
        } else {
            return '<h2>Loading...</h2>'
        }
    }

    render(){
        if(this.state.render){
            return (
                <div className="results">
                    <ReactEcharts className="alignmentPlot" option={ChartOptions(this.state.xAxis, this.state.yAxis, this.state.description, this.state.range)} /*opts={{ renderer: 'svg' }}*//>
                    <div id="textResults">
                        <div className="alignmentText" dangerouslySetInnerHTML={{ __html: this.htmlDecode() }}></div>
                        <div>
                            <input className='min' type="text" name='min' onChange={event => {
                                if(event.target.value < this.alignment.getSequenceStartPosition(0))
                                    this.min = this.alignment.getSequenceStartPosition(0);
                                else
                                    this.min = parseInt(event.target.value);
                            }}/>
                            <input className='max' type="text" name='max' onChange={event => {
                                if(event.target.value > this.alignment.getSequenceEndPosition(0))
                                    this.max = this.alignment.getSequenceEndPosition(0);
                                else
                                    this.max = parseInt(event.target.value);
                            }}/>
                            <input type="submit" value="Ajust" onClick={(event) => this.adjustTextResults(event, false)}/>
                            <input type="submit" value='Reset' onClick={(event) => this.adjustTextResults(event, true)} />
                        </div>
                    </div>
                </div>
            );
        } else {
            const { errors } = this.state;
            return (
                <h1>ERROR: { errors }</h1>
            );
        }
    }
}