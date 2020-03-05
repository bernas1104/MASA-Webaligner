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
    _gaps = new GapList.module(SEQUENCES_NUMBER);
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

    setRawScore = (rawScore) => { this._rawScore = rawScore };
    getRawScore = () => ( _rawScore );
    
    setGaps = (id, gapList) => {
        this._gaps[id] = gapList;
        this._gaps[id].computeOffsets(this._startPosition[id], this._endPosition[id]);

        this._startOffset[id] = 0;
        this._endOffset[id] = Math.abs(this._endPosition[id] - this._startPosition[id])
            + gapList.getGapsCount();

        if(this._gaps[0] !== undefined && this._gaps[1] !== undefined)
            this._createGapSequence();
    }
    getGaps = (id) => ( this._gaps[id] );

    setBoundaryPositions = (id, start, end) => {
        this._startPosition[id] = start;
        this._endPosition[id] = end;

        this._dir[id] = (start < end) ? 1 : -1;
    }

    setBoundaryOffset = (i, start, end) => {
        this._startOffset[i] = start;
        this._endOffset[i] = end;
    }

    getSequenceStartPosition = (id) => ( this._startPosition[id] );

    getSequenceEndPosition = (id) => ( this._endPosition[id] );

    getSequenceStartOffset = (id) => ( this._startOffset[id] );

    getSequenceEndOffset = (id) => ( this._endOffset[id] );

    getSequenceDirection = (id) => ( this._dir[id] );

    getSequenceOffset = (id, position) => ( this._gaps[id].getOffset(position) );

    getSequencePosition = (id, offset) => ( this._gaps[id].getOffset(offset) );

    // FUNÇÕES COM DEPENDENCIAS

    _createGapSequence = () => {
        this._gapSequence = new Array();

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
                gap1 = new GapSequence.module({ second: { gap: this._gaps[1][c1], i, j, dir: dirI,
                    gapType: GapSequence.module.GapType.SEQUENCE_1 } });
            }

            if(c0 >= 0 && c0 < this._gaps[0].length){
                gap0 = new GapSequence.module({ second: { gap: this._gaps[0][c0], i, j, dir: dirJ,
                    gapType: GapSequence.module.GapType.SEQUENCE_0 } });
            }

            let gap;
            if(gap1 === null || (gap0 !== null && gap0.getDist(i, j) < gap1.getDist(i, j))){
                gap = gap0;
                c0 += dirI;
            } else {
                gap = gap1;
                c1 += dirJ;
            }

            this._gapSequence.push(gap);
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
            this._sequenceWithGaps[id] = new SequenceWithGaps.module(
                this._alignmentParams.getSequence(id).getData(),
                this._gaps[id]
            );
        }

        return this._sequenceWithGaps[id];
    }

    // FUNÇÕES COM DEPENDENCIAS

    setBlocks = (blocks) => { this._blocks = blocks };
    getBlocks = () => ( this._blocks );

    setMatches = (matches) => { this._matches = matches };
    getMatches = () => ( this._matches );

    setMismatches = (mismatches) => { this._mismatches = mismatches };
    getMismatches = () => ( this._mismatches );

    setGapOpen = (gapOpen) => { this._gapOpen = gapOpen };
    getGapOpen = () => ( this._gapOpen );

    setGapExtensions = (gapExtensions) => { this._gapExtensions = gapExtensions };
    getGapExtensions = () => ( this._gapExtensions );
}

exports.module = Alignment;