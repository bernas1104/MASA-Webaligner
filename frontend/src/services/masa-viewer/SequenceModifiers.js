export default class SequenceModifiers {
    static _flags = {
        FLAG_CLEAR_N: 0x0004,
        FLAG_COMPLEMENT: 0x0002,
        FLAG_REVERSE: 0x0001
    }

    _trimStart;
    _trimEnd;
    _cleanN;
    _complement;
    _reverse;

    setTrimPositions = (trimStart, trimEnd) => {
        this._trimStart = trimStart;
        this._trimEnd = trimEnd;
    }

    setFlags = (flags) => {
        this._cleanN = (flags & SequenceModifiers._flags.FLAG_CLEAR_N) > 0;
        this._complement = (flags & SequenceModifiers._flags.FLAG_COMPLEMENT) > 0;
        this._reverse = (flags & SequenceModifiers._flags.FLAG_REVERSE) > 0;
    }

    getTrimStart = () => ( this._trimStart );
    getTrimEnd = () => ( this._trimEnd );

    isCleanN = () => ( this._cleanN );
    isComplement = () => ( this._complement );
    isReverse = () => ( this._reverse );
}

for(let key in SequenceModifiers._flags){
    Object.defineProperty(SequenceModifiers._flags, key, {
        value: SequenceModifiers._flags[key],
        writable: false
    });
}

// exports.module = SequenceModifiers;