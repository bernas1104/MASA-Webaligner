export default class Sequence {
    _info;
    _modifiers;
    _data;

    constructor(info, modifiers) {
        this._info = info;
        this._modifiers = modifiers;
    }

    getInfo = () => ( this._info );
    setInfo = (info) => { this._info = info };

    getModifiers = () => ( this._modifiers );
    setModifiers = (modifiers) => { this._modifiers = modifiers };

    getData = () => ( this._data );
    setData = (data) => { this._data = data };
}

// exports.module = Sequence;