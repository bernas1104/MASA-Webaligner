import React, { Component } from 'react';
import Dypragh from 'dygraphs';

import api from '../../services/api';
import AlignmentBinaryFile from '../../services/masa-viewer/AlignmentBinaryFile';
import SequenceData from '../../services/masa-viewer/SequenceData';
import TextChunk from '../../services/masa-viewer/TextChunk';
import TextChunkSum from '../../services/masa-viewer/TextChunkSum';

import './styles.scss';


export default class ShowAlignment extends Component {
    constructor(props){
        super(props);

        this.state = {
            _id: null,
            alignment: null,
            sequences: null,
            textChunkSum: null,
            chunks: null,
            description: null,
            xRange: null,
            yRange: null,
            render: true
        };
    }

    async componentDidMount() {
        try {
            const { data: { _id } } = await api.get(`/alignments/${this.props.match.params.id}`);
            this.setState({ _id });

            const chunks = await this.buildResults();
            this.setState({ chunks });

            const s0gapped = this.state.alignment.getAlignmentWithGaps(0).getSB();
            const s1gapped = this.state.alignment.getAlignmentWithGaps(1).getSB();
            console.log(s0gapped.length);
            
            let data = '';
            for(var i = 0, j = 1, l = 1; i < s0gapped.length; i++){
                if(s0gapped[i] === s1gapped[i]){
                    data += `${j++},${l++}\n`;
                } else {
                    if(s0gapped[i] !== '-' && s1gapped[i] !== '-'){
                        data += `${j++},${l++}\n`;
                    } else if (s0gapped[i] === '-'){
                        data += `${j},${l++}\n`;
                    } else {
                        data += `${j++},${l}\n`;
                    }
                }
            }

            const graph = new Dypragh(
                'alignmentPlot',
                'Seq0,Seq1\n' +
                data, {
                    showRangeSelector: true,
                    drawGrid: false,
                    valueRange: [0, this.state.alignment.getSequenceEndPosition(1)]
                }
            );

            const rangeSliders = document.querySelectorAll('body');
            rangeSliders.forEach(rangerSlider => {
                rangerSlider.onkeyup = (event) => {
                    if(event.keyCode === 13){
                        this.setState({ 
                            xRange: graph.xAxisRange(),
                            yRange: graph.yAxisRange(),
                        });
                        console.log(this.state.xRange, this.state.yRange);
                    }
                }
            });
        } catch (err) {
            this.setState({
                render: false
            })
        }
    }

    buildResults = async () => {
        const { data: { data } } = await api.get(`/bin/${this.state._id}`);
        const buff = new Buffer(data);

        this.setState({ alignment: AlignmentBinaryFile.read(buff) });
        this.setState({ sequences: this.state.alignment.getAlignmentParams().getSequences() });

        const description = [];
        description.push(this.state.alignment.getAlignmentParams().getSequence(0).getInfo().getDescription());
        description.push(this.state.alignment.getAlignmentParams().getSequence(1).getInfo().getDescription());
        this.setState({ description });

        try{
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

            return chunks;
        } catch (err) {
            console.log(err);
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
            chunk.setSuffix(`[${chunkScore}]/${this.state.textChunkSum.getScore()}]`);
        }
    
        return chunk;
    }

    htmlDecode = (chunks) => {
        if(chunks === null)
            return '<h2>Loading...</h2';
        else {
            let e = document.createElement('div');
            e.innerHTML = '';
            
            chunks.forEach(chunk => {
                e.innerHTML += chunk + '<br>';
            });

            return e.innerHTML;
        }
    }

    render(){
        if(this.state.render){
            return (
                <div className="results">
                    <div id="alignmentPlot"></div>
                    <div className="alignmentText" dangerouslySetInnerHTML={{ __html: this.htmlDecode(this.state.chunks) }}></div>
                </div>
            );
        } else {
            return (
                <h1>ERROR!</h1>
            );
        }
    }
}