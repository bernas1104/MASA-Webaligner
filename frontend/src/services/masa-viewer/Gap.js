export default class Gap {
    _offset;
    _position;
    _length;

    constructor(position, length) {
        this._position = position;
        this._length = length;
        this._offset = -1;
    }

    getPosition = () => ( this._position );
        
    getOffset = () => ( this._offset );
    setOffset = (offset) => { this._offset = offset };

    getLength = () => ( this._length );
    setLength = (length) => { this._length = length };
}