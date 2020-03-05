const Gap = require('./Gap');

class GapList extends Array {
    static serialVersionUID = 1;

    _initialized = false;
    _startPosition;
    _endPosition;
    _startOffset;
    _endOffset;
    _gapsCount;

    constructor(length) {
        super(length);
    }

    computeOffsets = (startPosition, endPosition, startOffset = 0) => {
        if(!this._initialized){
            this._startPosition = startPosition;
            this._endPosition = endPosition;
            this._startOffset = startOffset;

            let pos = Math.min(startPosition, endPosition);
            let offset = this._startOffset;
            this._gapsCount = 0;

            this.forEach(gap => {
                offset += gap.getPosition() - pos;
                gap.setOffset(offset);
                offset += gap.getLength();
                this._gapsCount += gap.getLength();
                pos = gap.getPosition();
            });

            this._endOffset = startOffset + Math.abs(startPosition - endPosition) + this._gapsCount;
            if(this._startOffset > this._endOffset){
                this.forEach(gap => {
                    gap.setOffset(this._endOffset - gap.getOffset() - gap.getLength());
                });
            }
            this._initialized = true;
        }
    }

    getOffset = (pos) => {
        if(pos < 1) {
            pos = 1;
        } else if (pos > Math.max(this._startPosition, this._endPosition)) {
            pos = Math.max(this._startPosition, this._endPosition);
        }

        let i0 = 0;
        let i1 = this.length;

        let offset;

        if(this.length === 0 || pos < this[0].getPosition()) {
            if(this._startPosition < this._endPosition) {
                offset = this._startOffset + (pos - this._startPosition);
            } else {
                offset = this._endOffset - (pos - this._endPosition);
            }
        } else {
            while(Math.abs(i1 - i0) > 1){
                let im = Math.floor((i0 + i1) / 2);

                let gapPos = this[im].getPosition();
                if(gapPos > pos) {
                    i1 = im;
                } else if (gapPos < pos) {
                    i0 = im;
                } else {
                    i0 = im;
                    i1 = im;
                }
            }

            let diffPos;
            if(this._startPosition < this._endPosition){
                diffPos = pos - this[i0].getPosition();

                if(diffPos === 0){
                    offset = this[i0].getOffset();
                } else {
                    offset = this[i0].getOffset() + this[i0].getLength() + diffPos;
                }
            } else {
                diffPos = pos - this[i0].getPosition();
                offset = this[i0].getOffset() - diffPos;
            }
        }

        return offset;
    }

    getPosition = (offset) => ( this.getPositionInfo(offset)[0] );

    getPositionRemainer = (offset) => ( getPositionInfo(offset)[1] );

    getPositionInfo = (offset) => {
        let i0 = 0;
        let i1 = this.length - 1;

        let dir = (this._startPosition > this._endPosition) ? -1 : +1;
        if(dir < 0) {
            let tmp = i0;
            i0 = i1;
            i1 = tmp;
        }

        let gapIndex = -1;

        let position;
        let remaining;

        if(this.length === 0 || offset < this[i0].getOffset()) {
            gapIndex = -1;
        } else if(offset > this[i1].getOffset()) {
            gapIndex = i1;
        } else {
            while(Math.abs(i1 - i0) > 1) {
                let im = Math.floor((i0 + i1) / 2);

                let gapOffset = this[im].getOffset();
                if(gapOffset > offset) {
                    i1 = im;
                } else if(gapOffset < offset) {
                    i0 = im;
                } else {
                    i0 = im;
                    i1 = im;
                }
            }
            gapIndex = i0;
        }

        if(gapIndex === -1){
            if(dir > 0){
                position = this._startPosition + offset;
            } else {
                position = this._startPosition - offset;
            }

            remaining = 0;
        } else {
            let diffOffset = offset - (this[gapIndex].getOffset() + this[gapIndex].getLength());
            
            if(diffOffset > 0) {
                position = this[gapIndex].getPosition() + diffOffset * dir;
                remaining = 0;
            } else {
                position = this[gapIndex].getPosition();
                remaining = -diffOffset;
            }
        }

        return [position, remaining];
    }

    getGapsCount = () => ( this._gapsCount );

    getStartPosition = () => ( this._startPosition );

    getEndPosition = () => ( this._endPosition );

    getStartOffset = () => ( this._startOffset );

    getEndOffset = () => ( this._endOffset );
}

exports.module = GapList;