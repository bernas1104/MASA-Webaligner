class SequenceWithGaps {
    _gaps;
    _endOffset;
    _offset;
    _done = true;
    _sb;

    constructor(sequence, gaps){
        this._gaps = gaps;

        let start = Math.min(this._gaps.getStartPosition(), this._gaps.getEndPosition());
        let end = Math.max(this._gaps.getStartPosition(), this._gaps.getEndPosition());

        const SIZE = 1024;
        let chars = new Array(SIZE).fill('-');

        let pos = start;
        gaps.forEach(gap => {
            //
        });
    }
}

const x = new SequenceWithGaps

exports.module = SequenceWithGaps;