class GapSequence {
    static GapType = { SEQUENCE_0: 'SEQUENCE_0', SEQUENCE_1: 'SEQUENCE_1' };
    
    _i0;
    _j0;
    _i1;
    _j1;
    _gapType;

    constructor(args){
        if(!!args.first){
            const { first: { i0, j0, i1, j1 } } = args;

            this._i0 = i0;
            this._j0 = j0;
            this._i1 = i1;
            this._j1 = j1;
        } else {
            const { second: { gap, i, j, dir, gapType } } = args;

            this._gapType = gapType;

            let diff;
            if(gapType === GapSequence.GapType.SEQUENCE_0) {
                this._i0 = gap.getPosition();
                this._i1 = this._i0;

                diff = Math.abs(gap.getPosition() - i);

                this._j0 = j + diff * dir;
                this._j1 = j + (diff + gap.getLength()) * dir;
            } else {
                this._j0 = gap.getPosition();
                this._j1 = this._j0;

                diff = Math.abs(gap.getPosition() - j);

                this._i0 = i + diff * dir;
                this._i1 = i + (diff + gap.getLength()) * dir;
            }
        }
    }

    getI0 = () => ( this._i0 );

    getJ0 = () => ( this._j0 );

    getI1 = () => ( this._i1 );

    getJ1 = () => ( this._j1 );

    getGapType = () => ( this._gapType );

    getDist = (i, j) => ( Math.max(Math.abs(i - this._i0), Math.abs(j - this._j0)) );
}

exports.module = GapSequence;