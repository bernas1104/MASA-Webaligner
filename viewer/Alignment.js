const GapList = require('./GapList');

const sequencesNumber = 2;

// Problems with adapt the 'private' specification here.
// Test with # sometime
class Alignment {
    _alignmentParams;

    constructor(paramsOrClone, i0 = null, i1 = null, j0 = null, j1 = null,
        offset0 = null, offset1 = null) {
        this._alignmentParams = paramsOrClone.constructor.name 
            === 'AlignmentParams' ? paramsOrClone : paramsOrClone._alignmentParams;
        let _rawScore;
        let _matches;
        let _mismatches;
        let _gapOpen;
        let _gapExtensions;
        let _startPosition = new Array(2);
        let _endPosition = new Array(2);
        let _startOffset = new Array(2);
        let _endOffset = new Array(2);
        let _gaps = new Array(2);
        let _dir = new Array(2);
        let _gapSequence;
        // let _sequenceWithGaps = new Array(2);   // SequenceWithGaps
        let _blocks;

        let _x = 1;

        this.getAlignmentParams = () => ( this._alignmentParams );

        this.setRawScore = (rawScore) => { _rawScore = rawScore };
        this.getRawScore = () => ( _rawScore );

        this.setGaps = (id, gapList) => {
            _gaps[id] = gapList;
            _gaps[id].computeOffsets(_startPosition[id], _endPosition[id]);

            _startOffset[id] = 0;
            _endOffset[id] = Math.abs(_endPosition[id] - _startPosition[id])
                + gapList.getGapsCount();
        }
        this.getGaps = (id) => ( _gaps[id] );

        this.setBoundaryPositions = (i, start, end) => {
            _startOffset[i] = start;
            _endOffset[i] = end;
        }

        this.setBoundaryOffset = (i, start, end) => {
            _startOffset[i] = start;
            _endOffset[i] = end;
        }

        this.getSequenceStartPosition = (id) => ( _startPosition[id] );

        this.getSequenceEndPosition = (id) => ( _endPosition[id] );

        this.getSequenceStartOffset = (id) => ( _startOffset[id] );

        this.getSequenceEndOffset = (id) => ( _endOffset[id] );

        this.getSequenceDirection = (id) => ( _dir[id] );

        // this.getSequenceOffset = (id, position) => ( _gaps[id].getOffset(position) );

        // this.getSequencePosition = (id, offset) => ( _gaps[id].getOffset(offset) );

        // this.createGapSequence = () => {}

        // FUNÇÕES COM DEPENDENCIAS

        this.setBlocks = (blocks) => { _blocks = blocks };
        this.getBlocks = () => ( _blocks );

        this.setMatches = (matches) => { _matches = matches };
        this.getMatches = () => ( _matches );

        this.setMismatches = (mismatches) => { _mismatches = mismatches };
        this.getMismatches = () => ( _mismatches );

        this.setGapOpen = (gapOpen) => { _gapOpen = gapOpen };
        this.getGapOpen = () => ( _gapOpen );

        this.setGapExtensions = (gapExtensions) => { _gapExtensions = gapExtensions };
        this.getGapExtensions = () => ( _gapExtensions );

        if(paramsOrClone.constructor.name === 'AlignmentParams'){
            _startOffset[0] = 0;
            _endOffset[0] = -1;
            _startOffset[1] = 1;
            _endOffset[1] = - 1;
        } else {
            this.setBoundaryPositions(0, i0, i1);
            this.setBoundaryPositions(1, j0, j1);
            this.setBoundaryOffset(0, offset0, offset1);
            this.setBoundaryOffset(1, offset0, offset1);
        }
    }
}

exports.module = Alignment;