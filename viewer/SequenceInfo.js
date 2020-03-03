class SequenceInfo {
    static SequenceType = {DNA: 1, RNA: 2, PROTEIN: 3, UNKNOWN: 255};

    constructor(){
        let _description;
        let _type;
        let _size;
        let _hash;
        let _data;

        this.getDescription = () => ( _description );
        this.setDescription = (description) => { _description = description }

        this.getType = () => ( _type );
        this.setType = (type) => { _type = type };

        this.getSize = () => ( _size );
        this.setSize = (size) => { _size = size };

        this.getHash = () => ( _hash );
        this.setHash = (hash) => { _hash = hash };

        this.getData = () => ( _data );
        this.setData = (data) => { _data = data };

        this.getAccessionNumber = () => { return SequenceInfo.getAccessionNumber(_description) }
    }

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

exports.module = SequenceInfo;