class Gap {
    constructor(position, length) {
        let _offset = -1;
        let _position = position;
        let _length = length;

        this.getPosition = () => ( _position );
        
        this.getOffset = () => ( _offset );
        this.setOffset = (offset) => { _offset = offset };

        this.getLength = () => ( _length );
        this.setLength = (length) => { _length = length };
    }
}

exports.module = Gap;