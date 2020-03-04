const fs = require('fs');

class SequenceData {
    _sb;

    _reverseData;
    _offset0;
    _offset1;

    constructor(args){
        if(!args)
            this._sb = null;
        else {
            const { file, modifiers } = args;

            const reader = fs.readFileSync(file, 'utf-8');

            let complement_map = new Array(256);
            for(let i = 0; i < 256; i++)
                complement_map[i] = String.fromCharCode(i).toUpperCase();

            if(modifiers.isComplement()) {
                complement_map['A'] = complement_map['a'] = 'T';
                complement_map['T'] = complement_map['t'] = 'A';
                complement_map['C'] = complement_map['c'] = 'G';
                complement_map['G'] = complement_map['g'] = 'C';
            }

            this._sb = '';
            for(let i = reader.indexOf('\n'); i < reader.length; i++){
                if(reader[i] === '\r' || reader[i] === '\n' || reader[i] === ' ') continue;
                if(modifiers.isCleanN() && 
                    (String.fromCharCode(reader[i]) === 'N' || String.fromCharCode(reader[i] === 'n'))) continue;

                this._sb += complement_map[reader.charCodeAt(i)];
            }
        }
    }

    getSb = () => ( this._sb );
    setSb = (sb) => { this._sb = sb };

    getReverseData = () => ( this._reverseData );
    setReverseData = (reverseData) => { this._reverseData = reverseData };

    getOffset0 = () => ( this._offset0 );
    getOffset1 = () => ( this._offset1 );

    getData = (beginIndex, endIndex) => {
        if(beginIndex === null && endIndex === null){
            if(this._sb == null)
                return null;

            return this._sb;
        } else {
            if(this._sb == null || beginIndex > endIndex || beginIndex < 0){
                let chars = new Array(endIndex - beginIndex);
                
                chars.fill('?');
                
                return chars.join('');
            } else {
                return this._sb.slice(beginIndex, endIndex);
            }
        }
    }
}

exports.module = SequenceData;