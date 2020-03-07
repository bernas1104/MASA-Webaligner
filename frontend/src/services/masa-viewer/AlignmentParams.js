export default class AlignmentParams {
    static AlignmentMethod = { GLOBAL: 1, LOCAL: 2 };
    static PenaltySystem = { LINEAR_GAP: 1, AFFINE_GAP: 2 };
    static ScoreSystem = { MATCH_MISMATCH: 1, SIMILARITY_MATRIX: 2 };

    _sequences = [];

    _alignmentMethod;
    _penaltySystem;
    _scoreSystem;

    _match;
    _mismatch;

    _gapOpen;
    _gapExtension;

    getSequence = (id) => ( this._sequences[id] );
    getSequencesCount = () => ( this._sequences.length );

    getMatch = () => ( this._match );
    setMatch = (match) => { this._match = match };

    getMismatch = () => ( this._mismatch );
    setMismatch = (mismatch) => { this._mismatch = mismatch };

    getGapOpen = () => ( this._gapOpen );
    setGapOpen = (gapOpen) => { this._gapOpen = gapOpen };

    getGapExtension = () => ( this._gapExtension );
    setGapExtension = (gapExtension) => { this._gapExtension = gapExtension };

    setAffineGapPenalties = (gapOpen, gapExtension) => {
        this._gapOpen = gapOpen;
        this._gapExtension = gapExtension;
    }

    setMatchMismatchScores = (match, mismatch) => {
        this._match = match;
        this._mismatch = mismatch;
    }

    getAlignmentMethod = () => ( this._alignmentMethod );
    setAlignmentMethod = (alignmentMethod) => { this._alignmentMethod = alignmentMethod };

    getPenaltySystem = () => ( this._penaltySystem );
    setPenaltySystem = (penaltySystem) => { this._penaltySystem = penaltySystem };

    getScoreSystem = () => ( this._scoreSystem );
    setScoreSystem = (scoreSystem) => { this._scoreSystem = scoreSystem };

    addSequence = (sequence) => { this._sequences.push(sequence) };
    getSequences = () => ( this._sequences );
}

for(let key in AlignmentParams.AlignmentMethod) {
    Object.defineProperty(AlignmentParams.AlignmentMethod, key, {
        value: AlignmentParams.AlignmentMethod[key],
        writable: false,
    });
};

for(let key in AlignmentParams.PenaltySystem) {
    Object.defineProperty(AlignmentParams.PenaltySystem, key, {
        value: AlignmentParams.PenaltySystem[key],
        writable: false,
    });
};

for(let key in AlignmentParams.ScoreSystem) {
    Object.defineProperty(AlignmentParams.ScoreSystem, key, {
        value: AlignmentParams.ScoreSystem[key],
        writable: false,
    });
};

// exports.module = AlignmentParams;