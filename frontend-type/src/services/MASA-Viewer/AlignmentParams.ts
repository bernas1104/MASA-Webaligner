import Sequence from './Sequence';

export default class AlignmentParams {
  static readonly AlignmentMethod = { GLOBAL: 1, LOCAL: 2 };

  static readonly PenaltySystem = { LINEAR_GAP: 1, AFFINE_GAP: 2 };

  static readonly ScoreSystem = { MATCH_MISMATCH: 1, SIMILARITY_MATRIX: 2 };

  private sequences: Sequence[] = [];

  private alignmentMethod: string;

  private penaltySystem: string;

  private scoreSystem: string;

  private match: number;

  private mismatch: number;

  private gapOpen: number;

  private gapExtension: number;

  constructor() {
    this.alignmentMethod = '';
    this.penaltySystem = '';
    this.scoreSystem = '';
    this.match = 0;
    this.mismatch = 0;
    this.gapOpen = 0;
    this.gapExtension = 0;
  }

  getSequence = (id: number): Sequence => this.sequences[id];

  getSequencesCount = (): number => this.sequences.length;

  getMatch = (): number => this.match;

  setMatch = (match: number): void => {
    this.match = match;
  };

  getMismatch = (): number => this.mismatch;

  setMismatch = (mismatch: number): void => {
    this.mismatch = mismatch;
  };

  getGapOpen = (): number => this.gapOpen;

  setGapOpen = (gapOpen: number): void => {
    this.gapOpen = gapOpen;
  };

  getGapExtension = (): number => this.gapExtension;

  setGapExtension = (gapExtension: number): void => {
    this.gapExtension = gapExtension;
  };

  setAffineGapPenalties = (gapOpen: number, gapExtension: number): void => {
    this.gapOpen = gapOpen;
    this.gapExtension = gapExtension;
  };

  setMatchMismatchScores = (match: number, mismatch: number): void => {
    this.match = match;
    this.mismatch = mismatch;
  };

  getAlignmentMethod = (): string => this.alignmentMethod;

  setAlignmentMethod = (alignmentMethod: string): void => {
    this.alignmentMethod = alignmentMethod;
  };

  getPenaltySystem = (): string => this.penaltySystem;

  setPenaltySystem = (penaltySystem: string): void => {
    this.penaltySystem = penaltySystem;
  };

  getScoreSystem = (): string => this.scoreSystem;

  setScoreSystem = (scoreSystem: string): void => {
    this.scoreSystem = scoreSystem;
  };

  addSequence = (sequence: Sequence): void => {
    this.sequences.push(sequence);
  };

  getSequences = (): Sequence[] => this.sequences;
}
