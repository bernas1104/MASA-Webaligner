class Sequence {
    constructor(info, modifiers) {
        let _info;
        let _modifiers;
        let _data;

        _info = info;
        _modifiers = modifiers;

        this.getInfo = () => ( _info );
        this.setInfo = (info) => { _info = info };

        this.getModifiers = () => ( _modifiers );
        this.setModifiers = (modifiers) => { _modifiers = modifiers };

        this.getData = () => ( _data );
        this.setData = (data) => { _data = data };
    }
}

exports.module = Sequence;