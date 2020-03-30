import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';

import api from '../../services/api';
import AlignmentBinaryFile from '../../services/masa-viewer/AlignmentBinaryFile';
import SequenceData from '../../services/masa-viewer/SequenceData';
import TextChunk from '../../services/masa-viewer/TextChunk';
import TextChunkSum from '../../services/masa-viewer/TextChunkSum';

import ChartOptions from './functions/ChartOptions';

import './styles.scss';

export default class ShowAlignment extends Component {
    static alignment  = 0x0001;
    static binFiles   = 0x0002;
    static fastaFiles = 0x0004;
    timeOut = 0;

    constructor(props){
        super(props);

        this.state = {
            _id: null,
            alignment: null,
            sequences: null,
            textChunkSum: null,
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

        const s0gapped = this.state.alignment.getAlignmentWithGaps(0).getSB();
        const s1gapped = this.state.alignment.getAlignmentWithGaps(1).getSB();
        
        const xAxis = [];
        const yAxis = [];
        for(var i = 0, 
                x = this.state.alignment.getSequenceStartPosition(0),
                y = this.state.alignment.getSequenceStartPosition(1); i < s0gapped.length; i++){
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

            this.setState({ alignment: AlignmentBinaryFile.read(buff) });
            this.setState({ sequences: this.state.alignment.getAlignmentParams().getSequences() });

            const description = [];
            description.push(this.state.alignment.getAlignmentParams().getSequence(0).getInfo().getDescription());
            description.push(this.state.alignment.getAlignmentParams().getSequence(1).getInfo().getDescription());
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
            this.state.sequences[0].setData(new SequenceData({ file: s0file, modifiers: this.state.sequences[0].getModifiers() }));
            this.state.sequences[1].setData(new SequenceData({ file: s1file, modifiers: this.state.sequences[1].getModifiers() }));

            if(this.state.alignment !== undefined && this.state.alignment.getAlignmentParams().getSequence(0).getData() !== undefined &&
                this.state.alignment.getAlignmentParams().getSequence(1).getData() !== undefined){
                    
                this.state.alignment.getAlignmentWithGaps(0).reset(this.state.alignment.getSequenceStartOffset(0), this.state.alignment.getSequenceEndOffset(0));
                this.state.alignment.getAlignmentWithGaps(1).reset(this.state.alignment.getSequenceStartOffset(1), this.state.alignment.getSequenceEndOffset(1));
                this.setState({ textChunkSum: new TextChunkSum(
                    this.state.alignment.getAlignmentParams().getMatch(),
                    this.state.alignment.getAlignmentParams().getMismatch(),
                    this.state.alignment.getAlignmentParams().getGapOpen(),
                    this.state.alignment.getAlignmentParams().getGapExtension()
                )});


                var chunks = [];
                while(this.hasMoreChunks()) {
                    let chunk = this.getNextChunk(60);
                    chunks.push(chunk.getHTMLString());
                }

                chunks.push(this.state.textChunkSum.getHTMLString());
            }

            this.setState({ chunks });
        } catch (err) {
            this.setState({
                render: false,
                errors: this.state.errors + ShowAlignment.fastaFiles
            });
        }
    }

    getSeq0WithGaps = () => {
        return this.state.alignment.getAlignmentWithGaps(0);
    }
    
    getSeq1WithGaps= () => {
        return this.state.alignment.getAlignmentWithGaps(1);
    }
    
    hasMoreChunks = () => {
        return(!this.state.alignment.getAlignmentWithGaps(0).isDone() && !this.state.alignment.getAlignmentWithGaps(1).isDone());
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
    
            let chunkScore = this.state.textChunkSum.sumChunk(chunk);
            chunk.setSuffix(`[${chunkScore}]/[${this.state.textChunkSum.getScore()}]`);
        }
    
        return chunk;
    }

    adjustTextResults = (event) => {
        event.preventDefault();

        this.setState({ chunks: null });

        setTimeout(() => {
            let alignment = this.state.alignment;

            let xRange = [document.querySelector('.min').value, document.querySelector('.max').value];
            let lowX = xRange[0] >= 0 ? Math.ceil(xRange[0]) : 0;
            let highX = Math.floor(xRange[1]);
        
            let lowY = this.state.xAxis[alignment.getSequenceOffset(0, lowX)];
            let highY = this.state.yAxis[alignment.getSequenceOffset(0, highX)] + 1;

            let offsetY0 = alignment.getSequenceOffset(1, lowY);
            let offsetY1 = alignment.getSequenceOffset(1, highY) + 1;
            let offsetX0 = alignment.getSequenceOffset(0, lowX);
            let offsetX1 = alignment.getSequenceOffset(0, highX);

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

            if(offset0 > offset1)
                return;

            this.setState({ alignment: alignment.truncate(offset0, offset1) });
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
                    <ReactEcharts className="alignmentPlot" option={ChartOptions(this.state.xAxis, this.state.yAxis, this.state.description, this.state.range)} opts={{ renderer: 'svg' }}/>
                    <div id="textResults">
                        <div className="alignmentText" dangerouslySetInnerHTML={{ __html: this.htmlDecode() }}></div>
                        <div>
                            <input className='min' type="text" name='min'/>
                            <input className='max' type="text" name='max'/>
                            <input type="submit" value="Ajust" onClick={(event) => this.adjustTextResults(event)}/>
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