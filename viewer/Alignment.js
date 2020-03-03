const GapList = require('./GapList');
const GapSequence = require('./GapSequence');
const SequenceWithGaps = require('./SequenceWithGaps');

const SEQUENCES_NUMBER = 2;

class Alignment {
    _alignmentParams;

    _alignmentParams;
    _rawScore;
    _matches;
    _mismatches;
    _gapOpen;
    _gapExtensions;
    _startPosition = new Array(SEQUENCES_NUMBER);
    _endPosition = new Array(SEQUENCES_NUMBER);
    _startOffset = new Array(SEQUENCES_NUMBER);
    _endOffset = new Array(SEQUENCES_NUMBER);
    _gaps = new GapList.module(2);
    _dir = new Array(SEQUENCES_NUMBER);
    _gapSequence;
    _sequenceWithGaps = new Array(SEQUENCES_NUMBER);
    _blocks;

    constructor(paramsOrClone, opts){
        if(!opts)
            this._alignmentParams = paramsOrClone;
        else{
            const { i0, i1, j0, j1, offset0, offset1 } = opts

            this._alignmentParams = paramsOrClone._alignmentParams;
            this.setBoundaryPositions(0, i0, i1);
            this.setBoundaryPositions(1, j0, j1);
            this.setBoundaryOffset(0, offset0, offset1);
            this.setBoundaryOffset(1, offset0, offset1);
            
            this._gaps = paramsOrClone._gaps;
            this._gapSequence = paramsOrClone._gapSequence;
            this._sequenceWithGaps = paramsOrClone._sequenceWithGaps;
        }
    }

    getAlignmentParams = () => ( this._alignmentParams );

    setRawScore = (rawScore) => { _rawScore = rawScore };
    getRawScore = () => ( _rawScore );
    
    setGaps = (id, gapList) => {
        _gaps[id] = gapList;
        _gaps[id].computeOffsets(_startPosition[id], _endPosition[id]);

        _startOffset[id] = 0;
        _endOffset[id] = Math.abs(_endPosition[id] - _startPosition[id])
            + gapList.getGapsCount();
    }
    getGaps = (id) => ( _gaps[id] );

    setBoundaryPositions = (i, start, end) => {
        _startOffset[i] = start;
        _endOffset[i] = end;
    }

    setBoundaryOffset = (i, start, end) => {
        _startOffset[i] = start;
        _endOffset[i] = end;
    }

    getSequenceStartPosition = (id) => ( _startPosition[id] );

    getSequenceEndPosition = (id) => ( _endPosition[id] );

    getSequenceStartOffset = (id) => ( _startOffset[id] );

    getSequenceEndOffset = (id) => ( _endOffset[id] );

    getSequenceDirection = (id) => ( _dir[id] );

    getSequenceOffset = (id, position) => ( _gaps[id].getOffset(position) );

    getSequencePosition = (id, offset) => ( _gaps[id].getOffset(offset) );

    // FUNÇÕES COM DEPENDENCIAS

    _createGapSequence = () => {
        gapSequence = new Array();

        let i = this._startPosition[0];
        let j = this._startPosition[1];

        let dirI = this.getSequenceDirection(0);
        let dirJ = this.getSequenceDirection(1);

        let c0 = dirI > 0 ? 0 : this._gaps[0].length - 1;
        let c1 = dirJ > 0 ? 0 : this._gaps[1].length - 1;

        while((c0 >= 0 && c0 < this._gaps[0].length) || (c1 >= 0 && c1 < this._gaps[1].length)) {
            let gap0 = null;
            let gap1 = null;

            if(c1 >= 0 && c1 < this._gaps[1].length){
                gap1 = new GapSequence({ second: { gaps: this._gaps[1][c1], i, j, dir: dirI,
                    gapType: GapSequence.module.GapType.SEQUENCE_1 } });
            }

            if(c0 >= 0 && c0 < this._gaps[0].length){
                gap2 = new GapSequence({ second: { gaps: this._gaps[0][c0], i, j, dir: dirJ,
                    gapType: GapSequence.module.GapType.SEQUENCE_0 } });
            }

            let gap;
            if(gap1 == null || (gap0 != null && gap0.getDist(i, j) < gap1.getDist(i, j))){
                gap = gap0;
                c0 += dirI;
            } else {
                gap = gap1;
                c1 += dirJ;
            }

            gapSequence.add(gap);
            i = gap.getI1();
            j = gap.getJ1();
        }
    }

    getGapSequences = () => {
        if(this._gapSequence == undefined){
            this._createGapSequence();
        }
        return this._gapSequence;
    }

    truncate = (cutOffset0, cutOffset1) => {
        let cutI0 = this._gaps[0].getPosition(cutOffset0);
        let cutI1 = this._gaps[0].getPosition(cutOffset1);

        let cutJ0 = this._gaps[1].getPosition(cutOffset0);
        let cutJ1 = this._gaps[1].getPosition(cutOffset1);

        return new Alignment(this, { i0: cutI0, i1: cutI1, j0: cutJ0, j1: cutJ1,
            offset0: cutOffset0, offset1: cutOffset1 });
    }

    getAlignmentWithGaps = (id) => {
        if(this._sequenceWithGaps[id] === undefined){
            this._sequenceWithGaps[id] = new SequenceWithGaps(
                this._alignmentParams.getSequence(id).getData(),
                this._gaps[id]
            );
        }
    }

    // FUNÇÕES COM DEPENDENCIAS

    setBlocks = (blocks) => { _blocks = blocks };
    getBlocks = () => ( _blocks );

    setMatches = (matches) => { _matches = matches };
    getMatches = () => ( _matches );

    setMismatches = (mismatches) => { _mismatches = mismatches };
    getMismatches = () => ( _mismatches );

    setGapOpen = (gapOpen) => { _gapOpen = gapOpen };
    getGapOpen = () => ( _gapOpen );

    setGapExtensions = (gapExtensions) => { _gapExtensions = gapExtensions };
    getGapExtensions = () => ( _gapExtensions );
}

const x = new Alignment();
console.log(x._sequenceWithGaps[0] === undefined);

exports.module = Alignment;