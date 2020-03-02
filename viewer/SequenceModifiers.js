class SequenceModifiers {
    constructor() {
        let _flags = {
            FLAG_CLEAR_N: 0x0004,
            FLAG_COMPLEMENT: 0x0002,
            FLAG_REVERSE: 0x0001
        }

        for(let key in _flags){
            Object.defineProperty(_flags, key, {
                value: _flags[key],
                writable: false
            })
        }

        let _trimStart;
        let _trimEnd;
        let _cleanN;
        let _complement;
        let _reverse;

        this.setTrimPositions = (trimStart, trimEnd) => {
            _trimStart = trimStart;
            _trimEnd = trimEnd;
        }

        this.setFlags = (flags) => {
            _cleanN = (flags & _flags.FLAG_CLEAR_N) > 0;
            _complement = (flags & _flags.FLAG_COMPLEMENT) > 0;
            _reverse = (flags & _flags.FLAG_REVERSE) > 0;
        }

        this.getTrimStart = () => ( _trimStart );
        this.getTrimEnd = () => ( _trimEnd );

        this.isCleanN = () => ( _cleanN );
        this.isComplement = () => ( _complement );
        this.isReverse = () => ( _reverse );
    }
}

exports.module = SequenceModifiers;