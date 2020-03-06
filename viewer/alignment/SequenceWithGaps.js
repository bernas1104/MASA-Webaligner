class SequenceWithGaps {
    _gaps;
    _endOffset;
    _offset;
    _done = true;
    _sb = '';

    constructor(sequence, gaps){
        this._gaps = gaps;

        let start = Math.min(this._gaps.getStartPosition(), this._gaps.getEndPosition());
        let end = Math.max(this._gaps.getStartPosition(), this._gaps.getEndPosition());

        const SIZE = 1024;
        let chars = new Array(SIZE).fill('-');

        let pos = start;
        this._gaps.forEach(gap => {
            let nextPos = gap.getPosition();
            this._sb += sequence.getData(pos - 1, nextPos - 1);
            pos = nextPos;

            let count = gap.getLength();
            while(count > 0) {
                let len = Math.min(count, SIZE);
                let x= chars.slice(0, len);
                this._sb += chars.slice(0, len).join('');
                count -= len;
            }
        });

        this._sb += sequence.getData(pos - 1, end);
        if(this._gaps.getStartPosition() > this._gaps.getEndPosition()) {
            this._sb = this._sb.split('').reverse().join('');   // sb.reverse();
        }
    }

    reset = (startOffset, endOffset) => {
        this._offset = startOffset;
        this._endOffset = endOffset;
        this._done = false;
    }

    getCurrentPosition = () => ( this._gaps.getPosition(this._offset) );

    isDone = () => ( this._done );

    getNextChunk = (length) => {
        if(this.isDone()) {
            return '';
        } else {
            let nextOffset = Math.min(this._endOffset + 1, this._offset + length);

            let chunk = this._sb.slice(this._offset, nextOffset);
            
            if(nextOffset == this._endOffset + 1)
                this._done = true;

            this._offset = nextOffset;
            return chunk;
        }
    }
}

exports.module = SequenceWithGaps;