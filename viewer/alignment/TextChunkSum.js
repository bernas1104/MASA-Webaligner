class TextChunkSum {
    _score = 0;
    _gapOpeningsCount = 0;
    _gapExtensionsCount = 0;
    _matchesCount = 0;
    _mismatchesCount = 0;

    _qgap = false;
    _sgap = false;

    _matchScore;
    _mismatchScore;
    _gapOpenScore;
    _gapExtScore;

    constructor(match, mismatch, gapOpen, gapExt){
        this._matchScore = match;
        this._mismatchScore = mismatch;
        this._gapOpenScore = gapOpen;
        this._gapExtScore = gapExt;
    }
    
    sumChunk(chunk) {
        let tmp = 0;

        let c0 = chunk.getChunk0();
        let c1 = chunk.getChunk1();
        for(let k = 0; k < chunk.getSize(); k++){
            let q = c0[k];
            let s = c1[k];

            if(q === '-'){
                if(!qgap) {
                    tmp += this._gapOpenScore;
                    this._gapOpeningsCount++;
                }

                tmp += this._gapExtScore;
                this._gapExtensionsCount++;
                qgap = true;
                sgap = false;
            } else if(s === '-'){
                if(!sgap){
                    tmp += this._gapOpenScore;
                    this._gapOpeningsCount++;
                }

                tmp += this._gapExtScore;
                this._gapExtensionsCount++;
                qgap = false;
                sgap = true;
            } else {
                if(q === s){
                    tmp += this._matchScore;
                    this._matchesCount++;
                } else {
                    tmp += this._mismatchScore;
                    this._mismatchesCount++;
                }
                
                qgap = false;
                sgap = false;
            }
        }
        this._score += tmp;
        return tmp;
    }

    getScore = () => ( this._score );
    getGapOpeningsCount = () => ( this._gapOpeningsCount );
    getGapExtensionsCount = () => ( this._gapExtensionsCount );
    getMatchesCount = () => ( this._matchesCount );
    getMismatchesCount = () => ( this._mismatchesCount );
    getMatchesScore = () => ( this._matchScore );
    getMismatchesScore = () => ( this._mismatchScore );
    getGapOpenScore = () => ( this._gapOpenScore );
    getGapExtScore = () => ( this._gapExtScore );

    getHTMLString = () => (
        `<pre>` +
        `Total Score:             ${this._score}<br>` + 
        `Matches:                 ${this._matchCount} (+${this._matchScore})<br>` +
        `Mismatches:              ${this._mismatchesCount} (${this._mismatchScore})<br>` +
        `Gap Openings:            ${this._gapOpeningsCount} (${this._gapOpenScore})<br>` +
        `Gap Extensions:          ${this._gapExtensionsCount} (${this._gapExtScore})<br>` +
        `</pre>`
    );
}

exports.module = TextChunkSum;