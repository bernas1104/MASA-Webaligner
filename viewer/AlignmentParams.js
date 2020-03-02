class AlignmentParams {
    static AlignmentMethod = { GLOBAL: 1, LOCAL: 2 };
    static PenaltySystem = { LINEAR_GAP: 1, AFFINE_GAP: 2 };
    static ScoreSystem = { MATCH_MISMATCH: 1, SIMILARITY_MATRIX: 2 };

    constructor(){
        let _sequences = [];

        let _alignmentMethod;
        let _penaltySystem;
        let _scoreSystem;

        let _match;
        let _mismatch;

        let _gapOpen;
        let _gapExtension;

        this.getSequence = (id) => ( _sequences[id] );
        this.getSequencesCount = () => ( _sequences.length );

        this.getMatch = () => ( _match );
        this.setMatch = (match) => { _match = match };

        this.getMismatch = () => ( _mismatch );
        this.setMismatch = (mismatch) => { _mismatch = mismatch };

        this.getGapOpen = () => ( _gapOpen );
        this.setGapOpen = (gapOpen) => { _gapOpen = gapOpen };

        this.getGapExtension = () => ( _gapExtension );
        this.setGapExtension = (gapExtension) => { _gapExtension = gapExtension };

        this.setAffineGapPenalties = (gapOpen, gapExtension) => {
            _gapOpen = gapOpen;
            _gapExtension = gapExtension;
        }

        this.setMatchMismatchScores = (match, mismatch) => {
            _match = match;
            _mismatch = mismatch;
        }

        this.getAlignmentMethod = () => ( _alignmentMethod );
        this.setAlignmentMethod = (alignmentMethod) => { _alignmentMethod = alignmentMethod };

        this.getPenaltySystem = () => ( _penaltySystem );
        this.setPenaltySystem = (penaltySystem) => { _penaltySystem = penaltySystem };

        this.getScoreSystem = () => ( _scoreSystem );
        this.setScoreSystem = (scoreSystem) => { _scoreSystem = scoreSystem };

        this.addSequence = (sequence) => { _sequences.push(sequence) };
        this.getSequences = () => ( _sequences );
    }
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

exports.module = AlignmentParams;