export default class SequenceInfo {
    static SequenceType = {DNA: 1, RNA: 2, PROTEIN: 3, UNKNOWN: 255};

    _description;
    _type;
    _size;
    _hash;
    _data;

    getDescription = () => ( this._description );
    setDescription = (description) => { this._description = description }

    getType = () => ( this._type );
    setType = (type) => { this._type = type };

    getSize = () => ( this._size );
    setSize = (size) => { this._size = size };

    getHash = () => ( this._hash );
    setHash = (hash) => { this._hash = hash };

    getData = () => ( this._data );
    setData = (data) => { this._data = data };

    getAccessionNumber = () => { return SequenceInfo.getAccessionNumber(this._description) }

    static getAccessionNumber(description) {
        let tokens = description.split("\\|");
        if(tokens.length >= 3) {
            return tokens[3];
        } else {
            return description.split(" ")[0];
        }
    }
}

for(let key in SequenceInfo.SequenceType) {
    Object.defineProperty(SequenceInfo.SequenceType, key, {
        value: SequenceInfo.SequenceType[key],
        writable: false,
    });
}