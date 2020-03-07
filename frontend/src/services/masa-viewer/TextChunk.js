export function pad(int, size) {
    var s = String(int);
    while(s.length < (size || 2)) { s = ' ' + s }
    return s;
}

export default class TextChunk {
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
        return `Query: ${pad(this._i0, 8)} ${this._chunk0} ${pad(this._i1, 8)}\n` +
            `                ${this.getMatchString()} ${this._suffix}\n` +
            `Sbjct: ${pad(this._j0, 8)} ${this._chunk1} ${pad(this._j1, 8)}\n`;
    }

    getHTMLString = () => {
        let c0 = this._chunk0.replace(/[-]/g, '<span style="background: #FF9090">-</span>');
        let c1 = this._chunk1.replace(/[-]/g, '<span style="background: #FF9090">-</span>');

        return `<div><pre>` +
            `Query: ${pad(this._i0, 8)} ${c0} ${pad(this._i1, 8)}<br>` +
            `                ${this.getMatchString()} ${this._suffix}<br>` +
            `Sbjct: ${pad(this._j0, 8)} ${c1} ${pad(this._j1, 8)}<br>` + 
            `</pre></div>`;
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

// exports.module = TextChunk;