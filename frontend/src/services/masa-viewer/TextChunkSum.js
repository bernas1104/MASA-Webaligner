export default class TextChunkSum {
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

        for(let k = 0; k < chunk.getSize(); k++){
            let q = chunk.getChunk0()[k];
            let s = chunk.getChunk1()[k];

            if(q === '-'){
                if(!this._qgap) {
                    tmp += this._gapOpenScore;
                    this._gapOpeningsCount++;
                }

                tmp += this._gapExtScore;
                this._gapExtensionsCount++;
                this._qgap = true;
                this._sgap = false;
            } else if(s === '-'){
                if(!this._sgap){
                    tmp += this._gapOpenScore;
                    this._gapOpeningsCount++;
                }

                tmp += this._gapExtScore;
                this._gapExtensionsCount++;
                this._qgap = false;
                this._sgap = true;
            } else {
                if(q === s){
                    tmp += this._matchScore;
                    this._matchesCount++;
                } else {
                    tmp += this._mismatchScore;
                    this._mismatchesCount++;
                }
                
                this._qgap = false;
                this._sgap = false;
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

// exports.module = TextChunkSum;