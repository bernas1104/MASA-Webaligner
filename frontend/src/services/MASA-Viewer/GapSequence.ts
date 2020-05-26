import Gap from './Gap';

interface GapSequenceArgs {
  first?: {
    i0: number;
    j0: number;
    i1: number;
    j1: number;
  };
  second?: {
    gap: Gap;
    i: number;
    j: number;
    dir: number;
    gapType: string;
  };
}

export default class GapSequence {
  static readonly GapType = {
    SEQUENCE_0: 'SEQUENCE_0',
    SEQUENCE_1: 'SEQUENCE_1',
  };

  private i0 = 0;

  private j0 = 0;

  private i1 = 0;

  private j1 = 0;

  private gapType = '';

  constructor(args: GapSequenceArgs) {
    if (args.first) {
      const {
        first: { i0, j0, i1, j1 },
      } = args;

      this.i0 = i0;
      this.j0 = j0;
      this.i1 = i1;
      this.j1 = j1;
    } else if (args.second) {
      const {
        second: { gap, i, j, dir, gapType },
      } = args;

      this.gapType = gapType;

      let diff;
      if (gapType === GapSequence.GapType.SEQUENCE_0) {
        this.i0 = gap.getPosition();
        this.i1 = this.i0;

        diff = Math.abs(gap.getPosition() - i);

        this.j0 = j + diff * dir;
        this.j1 = j + (diff + gap.getLength()) * dir;
      } else {
        this.j0 = gap.getPosition();
        this.j1 = this.j0;

        diff = Math.abs(gap.getPosition() - j);

        this.i0 = i + diff * dir;
        this.i1 = i + (diff + gap.getLength()) * dir;
      }
    }
  }

  getI0 = (): number => this.i0;

  getJ0 = (): number => this.j0;

  getI1 = (): number => this.i1;

  getJ1 = (): number => this.j1;

  getGapType = (): string => this.gapType;

  getDist = (i: number, j: number): number =>
    Math.max(Math.abs(i - this.i0), Math.abs(j - this.j0));
}
