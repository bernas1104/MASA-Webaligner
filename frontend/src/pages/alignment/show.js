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
            render: true
        };
    }

    async componentDidMount() {
        try {
            const { data: { _id } } = await api.get(`/alignments/${this.props.match.params.id}`);
            this.setState({ _id });

            await this.buildResults();

            const s0gapped = this.state.alignment.getAlignmentWithGaps(0).getSB();
            const s1gapped = this.state.alignment.getAlignmentWithGaps(1).getSB();
            
            let data = '';
            const values = []
            for(var i = 0, j = 0, l = 0; i < s0gapped.length; i++){
                if(s0gapped[i] === s1gapped[i]){
                    data += `${j++},${l++}\n`;
                    values.push(l-1);
                } else {
                    if(s0gapped[i] !== '-' && s1gapped[i] !== '-'){
                        data += `${j++},${l++}\n`;
                        values.push(l-1);
                    } else if (s0gapped[i] === '-'){
                        data += `${j},${l++}\n`;
                        values.push(l-1);
                    } else {
                        data += `${j++},${l}\n`;
                        values.push(l);
                    }
                }
            }

            const graph = new Dypragh(
                'alignmentPlot',
                'Seq0,Seq1\n' +
                data, {
                    showRangeSelector: true,
                    drawGrid: false,
                    valueRange: [0, this.state.alignment.getSequenceEndPosition(1)],
                    rangeSelectorHeight: 20,
                }
            );

            const adjustText = document.querySelector('body');
            adjustText.onkeyup = (event) => {
                if(event.keyCode === 13){
                    let alignment = this.state.alignment;

                    let xRange = graph.xAxisRange();
                    let lowX = xRange[0] >= 0 ? Math.ceil(xRange[0]) : 0;
                    let highX = Math.floor(xRange[1]);
                
                    let lowY = values[alignment.getSequenceOffset(0, lowX)];
                    let highY = values[alignment.getSequenceOffset(0, highX)] + 1;

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
                }
            }
        } catch (err) {
            console.log(err);
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

            this.buildTextResults();
        } catch (err) {
            console.log(err);
        }
    }

    buildTextResults = () => {
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