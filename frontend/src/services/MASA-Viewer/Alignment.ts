import AlignmentParams from './AlignmentParams';
import GapList from './GapList';
import GapSequence from './GapSequence';
import SequenceWithGaps from './SequenceWithGaps';

interface AlignmentOPTS {
  i0: number;
  i1: number;
  j0: number;
  j1: number;
  offset0: number;
  offset1: number;
}

const SEQUENCES_NUMBER = 2;

export default class Alignment {
  private alignmentParams: AlignmentParams;

  private rawScore: number;

  private matches: number;

  private mismatches: number;

  private gapOpen: number;

  private gapExtensions: number;

  private startPosition: number[] = new Array(SEQUENCES_NUMBER);

  private endPosition: number[] = new Array(SEQUENCES_NUMBER);

  private startOffset: number[] = new Array(SEQUENCES_NUMBER);

  private endOffset: number[] = new Array(SEQUENCES_NUMBER);

  private gaps: GapList[] = new GapList(SEQUENCES_NUMBER);

  private dir: number[] = new Array(SEQUENCES_NUMBER);

  private gapSequence: GapSequence[];

  private sequenceWithGaps: SequenceWithGaps[] = new Array(SEQUENCES_NUMBER);

  private blocks: number[];

  constructor(
    paramsOrClone: AlignmentParams | Alignment,
    opts?: AlignmentOPTS,
  ) {
    this.rawScore = 0;
    this.matches = 0;
    this.mismatches = 0;
    this.gapOpen = 0;
    this.gapExtensions = 0;
    this.gapSequence = [];
    this.blocks = [];

    if (paramsOrClone instanceof AlignmentParams)
      this.alignmentParams = paramsOrClone;
    else {
      const { i0, i1, j0, j1, offset0, offset1 } = opts!;

      this.alignmentParams = paramsOrClone.alignmentParams;
      this.setBoundaryPositions(0, i0, i1);
      this.setBoundaryPositions(1, j0, j1);
      this.setBoundaryOffset(0, offset0, offset1);
      this.setBoundaryOffset(1, offset0, offset1);

      this.gaps = paramsOrClone.gaps;
      this.gapSequence = paramsOrClone.gapSequence;
      this.sequenceWithGaps = paramsOrClone.sequenceWithGaps;
    }
  }

  getAlignmentParams = (): AlignmentParams => this.alignmentParams;

  setRawScore = (rawScore: number): void => {
    this.rawScore = rawScore;
  };

  getRawScore = (): number => this.rawScore;

  setGaps = (id: number, gapList: GapList): void => {
    this.gaps[id] = gapList;
    this.gaps[id].computeOffsets(this.startPosition[id], this.endPosition[id]);

    this.startOffset[id] = 0;
    this.endOffset[id] =
      Math.abs(this.endPosition[id] - this.startPosition[id]) +
      gapList.getGapsCount();

    if (this.gaps[0] !== undefined && this.gaps[1] !== undefined)
      this.createGapSequence();
  };

  getGaps = (id: number): GapList => this.gaps[id];

  setBoundaryPositions = (id: number, start: number, end: number): void => {
    this.startPosition[id] = start;
    this.endPosition[id] = end;

    this.dir[id] = start < end ? 1 : -1;
  };

  setBoundaryOffset = (id: number, start: number, end: number): void => {
    this.startOffset[id] = start;
    this.endOffset[id] = end;
  };

  getSequenceStartPosition = (id: number): number => this.startPosition[id];

  getSequenceEndPosition = (id: number): number => this.endPosition[id];

  getSequenceStartOffset = (id: number): number => this.startOffset[id];

  getSequenceEndOffset = (id: number): number => this.endOffset[id];

  getSequenceDirection = (id: number): number => this.dir[id];

  getSequenceOffset = (id: number, position: number): number =>
    this.gaps[id].getOffset(position);

  getSequencePosition = (id: number, offset: number): number =>
    this.gaps[id].getOffset(offset);

  // FUNÇÕES COM DEPENDENCIAS

  private createGapSequence = (): void => {
    this.gapSequence = [];

    let i = this.startPosition[0];
    let j = this.startPosition[1];

    const dirI = this.getSequenceDirection(0);
    const dirJ = this.getSequenceDirection(1);

    let c0 = dirI > 0 ? 0 : this.gaps[0].length - 1;
    let c1 = dirJ > 0 ? 0 : this.gaps[1].length - 1;

    while (
      (c0 >= 0 && c0 < this.gaps[0].length) ||
      (c1 >= 0 && c1 < this.gaps[1].length)
    ) {
      let gap0 = null;
      let gap1 = null;

      if (c1 >= 0 && c1 < this.gaps[1].length) {
        gap1 = new GapSequence({
          second: {
            gap: this.gaps[1][c1],
            i,
            j,
            dir: dirI,
            gapType: GapSequence.GapType.SEQUENCE_1,
          },
        });
      }

      if (c0 >= 0 && c0 < this.gaps[0].length) {
        gap0 = new GapSequence({
          second: {
            gap: this.gaps[0][c0],
            i,
            j,
            dir: dirJ,
            gapType: GapSequence.GapType.SEQUENCE_0,
          },
        });
      }

      let gap;
      if (
        gap1 === null ||
        (gap0 !== null && gap0.getDist(i, j) < gap1.getDist(i, j))
      ) {
        gap = gap0;
        c0 += dirI;
      } else {
        gap = gap1;
        c1 += dirJ;
      }

      this.gapSequence.push(gap!);
      i = gap!.getI1();
      j = gap!.getJ1();
    }
  };

  getGapSequences = (): GapSequence[] => {
    if (this.gapSequence === undefined) {
      this.createGapSequence();
    }
    return this.gapSequence;
  };

  truncate = (cutOffset0: number, cutOffset1: number): Alignment => {
    const cutI0 = this.gaps[0].getPosition(cutOffset0);
    const cutI1 = this.gaps[0].getPosition(cutOffset1) - 1;

    const cutJ0 = this.gaps[1].getPosition(cutOffset0);
    const cutJ1 = this.gaps[1].getPosition(cutOffset1);

    return new Alignment(this, {
      i0: cutI0,
      i1: cutI1,
      j0: cutJ0,
      j1: cutJ1,
      offset0: cutOffset0,
      offset1: cutOffset1,
    });
  };

  getAlignmentWithGaps = (id: number): SequenceWithGaps => {
    if (this.sequenceWithGaps[id] === undefined) {
      this.sequenceWithGaps[id] = new SequenceWithGaps(
        this.alignmentParams.getSequence(id).getData(),
        this.gaps[id],
      );
    }

    return this.sequenceWithGaps[id];
  };

  // FUNÇÕES COM DEPENDENCIAS

  setBlocks = (blocks: number[]): void => {
    this.blocks = blocks;
  };

  getBlocks = (): number[] => this.blocks;

  setMatches = (matches: number): void => {
    this.matches = matches;
  };

  getMatches = (): number => this.matches;

  setMismatches = (mismatches: number): void => {
    this.mismatches = mismatches;
  };

  getMismatches = (): number => this.mismatches;

  setGapOpen = (gapOpen: number): void => {
    this.gapOpen = gapOpen;
  };

  getGapOpen = (): number => this.gapOpen;

  setGapExtensions = (gapExtensions: number): void => {
    this.gapExtensions = gapExtensions;
  };

  getGapExtensions = (): number => this.gapExtensions;

  getDir = (id: number): number => this.dir[id];
}
