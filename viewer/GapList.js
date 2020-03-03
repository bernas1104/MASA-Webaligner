const Gap = require('./Gap');

const serialVersionUID = 1;

class GapList extends Gap.module {
    constructor() {
        super();

        let _initialized = false;
        let _startPosition;
        let _endPosition;
        let _startOffset;
        let _endOffset;
        let _gapsCount;

        this.computeOffsets = (startPosition, endPosition, startOffset) => {
            if(!_initialized){
                _startPosition = startPosition;
                _endPosition = endPosition;
                _startOffset = startOffset;

                let pos = Math.min(startPosition, endPosition);
                let offset = _startOffset;
                _gapsCount = 0;

                for(let gap in this){
                    offset += gap.getPosition() - pos;
                    gap.setOffset(offset);
                    offset += gap.getLength();
                    _gapsCount += gap.getLength();
                    pos = gap.getPosition();
                }

                _endOffset = startOffset + Math.abs(startPosition - endPosition) + _gapsCount;
                if(_startOffset > _endOffset){
                    for(let gap in this){
                        gap.setOffset(_endOffset - gap.getOffset() - gap.getLength());
                    }
                }
                _initialized = true;
            }
        }

        this.computeOffsets = (startPosition, endPosition) => {
            this.computeOffsets(startPosition, endPosition, 0);
        }
    }
}

exports.module = GapList;