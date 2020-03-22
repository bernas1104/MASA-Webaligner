// import AlignmentBinaryFile from './../../../services/masa-viewer/AlignmentBinaryFile';
// import SequenceData from '../../../services/masa-viewer/SequenceData';
// import TextChunk from '../../../services/masa-viewer/TextChunk';
// import TextChunkSum from '../../../services/masa-viewer/TextChunkSum';

// import api from './../../../services/api'

// // export default {
//     async function buildResults() {
//         const { data: { data } } = await api.get(`/bin/${this.state._id}`);
//         const buff = new Buffer(data);

//         this.setState({ alignment: AlignmentBinaryFile.read(buff) });
//         this.setState({ sequences: this.state.alignment.getAlignmentParams().getSequences() });

//         const description = [];
//         description.push(this.state.alignment.getAlignmentParams().getSequence(0).getInfo().getDescription());
//         description.push(this.state.alignment.getAlignmentParams().getSequence(1).getInfo().getDescription());
//         this.setState({ description });

//         try{
//             const { data: { s0file, s1file }} = await api.get(`/fasta/${this.state._id}`);
//             this.state.sequences[0].setData(new SequenceData({ file: s0file, modifiers: this.state.sequences[0].getModifiers() }));
//             this.state.sequences[1].setData(new SequenceData({ file: s1file, modifiers: this.state.sequences[1].getModifiers() }));

//             buildTextResults();
//         } catch (err) {
//             console.log(err);
//         }
//     }

//     async function buildTextResults() {
//         if(this.state.alignment !== undefined && this.state.alignment.getAlignmentParams().getSequence(0).getData() !== undefined &&
//             this.state.alignment.getAlignmentParams().getSequence(1).getData() !== undefined){
                
//             this.state.alignment.getAlignmentWithGaps(0).reset(this.state.alignment.getSequenceStartOffset(0), this.state.alignment.getSequenceEndOffset(0));
//             this.state.alignment.getAlignmentWithGaps(1).reset(this.state.alignment.getSequenceStartOffset(1), this.state.alignment.getSequenceEndOffset(1));
//             this.setState({ textChunkSum: new TextChunkSum(
//                 this.state.alignment.getAlignmentParams().getMatch(),
//                 this.state.alignment.getAlignmentParams().getMismatch(),
//                 this.state.alignment.getAlignmentParams().getGapOpen(),
//                 this.state.alignment.getAlignmentParams().getGapExtension()
//             )});


//             var chunks = [];
//             while(this.hasMoreChunks()) {
//                 let chunk = this.getNextChunk(60);
//                 chunks.push(chunk.getHTMLString());
//             }

//             chunks.push(this.state.textChunkSum.getHTMLString());
//         }

//         this.setState({ chunks });
//     }

//     function getSeq0WithGaps() {
//         return this.state.alignment.getAlignmentWithGaps(0);
//     }
    
//     function getSeq1WithGaps() {
//         return this.state.alignment.getAlignmentWithGaps(1);
//     }
    
//     function hasMoreChunks() {
//         return(!this.state.alignment.getAlignmentWithGaps(0).isDone() && !this.state.alignment.getAlignmentWithGaps(1).isDone());
//     }
    
//     function getNextChunk(cols) {
//         let chunk = new TextChunk();
        
//         if(this.hasMoreChunks()){
//             chunk.setStartPositions(this.getSeq0WithGaps().getCurrentPosition(),
//                 this.getSeq1WithGaps().getCurrentPosition());
    
//             let chunk0 = this.getSeq0WithGaps().getNextChunk(cols);
//             let chunk1 = this.getSeq1WithGaps().getNextChunk(cols);
    
//             chunk.setEndPositions(this.getSeq0WithGaps().getCurrentPosition(),
//                 this.getSeq1WithGaps().getCurrentPosition());
    
//             chunk.setChunks(chunk0, chunk1);
    
//             let chunkScore = this.state.textChunkSum.sumChunk(chunk);
//             chunk.setSuffix(`[${chunkScore}]/${this.state.textChunkSum.getScore()}]`);
//         }
    
//         return chunk;
//     }
// // }

// export { buildResults, buildTextResults }