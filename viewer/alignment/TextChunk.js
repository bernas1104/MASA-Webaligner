Number.prototype.pad = function(size) {
    var s = String(this);
    while(s.length < (size || 2)) { s = ' ' + s }
    return s;
}

class TextChunk {
    _chunk0;
    _chunk1;
    _matchString;
    _i0;
    _i1;
    _j0;
    _j1;
    _size;
    _suffix;

    setStartPositions = (i, j) => {
        this._i0 = i;
        this._j0 = j;
    }

    setEndPositions = (i, j) => {
        this._i1 = i;
        this._j1 = j;
    }

    setChunks = (chunk0, chunk1) => {
        this._chunk0 = chunk0;
        this._chunk1 = chunk1;

        this._size = Math.min(this._chunk0.length, this._chunk1.length);
        if(this._chunk0.length !== this._chunk1.length){
            this._chunk0 = this._chunk0.slice(0, this._size);
            this._chunk1 = this._chunk1.slice(0, this._size);
        }
    }

    getTextString = () => {
        return `Query: ${this._i0.pad(8)} ${this._chunk0} ${this._i1.pad(8)}\n` +
            `                ${this.getMatchString()} ${this._suffix}\n` +
            `Sbjct: ${this._j0.pad(8)} ${this._chunk1} ${this._j1.pad(8)}\n`;
    }

    getHTMLString = () => {
        let c0 = this._chunk0.replace(/[-]/g, '<font bgcolor="#FF9090">-</font>');
        let c1 = this._chunk1.replace(/[-]/g, '<font bgcolor="#FF9090">-</font>');

        return `<pre>` +
            `     Query:          ${this._i0} ${c0}         ${this._i1}<br>` +
            `                ${this.getMatchString()} ${this._suffix}<br>` +
            `     Sbjct:         ${this._j0} ${c1}         ${this._j1}<br>` + 
            `</pre>`;
    }

    getMatchString = () => {
        if(this._matchString === undefined){
            let sb = '';
            for(let k = 0; k < this._size; k++){
                let q = this._chunk0[k];
                let s = this._chunk1[k];

                sb += q === s ? '|' : ' ';
            }

            this._matchString = sb;
        }

        return this._matchString;
    }

    getSize = () => ( this._size );
    getChunk0 = () => ( this._chunk0 );
    getChunk1 = () => ( this._chunk1 );

    setSuffix = (suffix) => { this._suffix = suffix };
}

exports.module = TextChunk;