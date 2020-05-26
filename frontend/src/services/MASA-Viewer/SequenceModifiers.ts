export default class SequenceModifiers {
  private static readonly flags = {
    FLAG_CLEAR_N: 0x0004,
    FLAG_COMPLEMENT: 0x0002,
    FLAG_REVERSE: 0x0001,
  };

  private trimStart: number;

  private trimEnd: number;

  private cleanN: boolean;

  private complement: boolean;

  private reverse: boolean;

  constructor() {
    this.trimStart = 0;
    this.trimEnd = 0;
    this.cleanN = false;
    this.complement = false;
    this.reverse = false;
  }

  setTrimPositions = (trimStart: number, trimEnd: number): void => {
    this.trimStart = trimStart;
    this.trimEnd = trimEnd;
  };

  setFlags = (flags: number): void => {
    this.cleanN = (flags & SequenceModifiers.flags.FLAG_CLEAR_N) > 0;
    this.complement = (flags & SequenceModifiers.flags.FLAG_COMPLEMENT) > 0;
    this.reverse = (flags & SequenceModifiers.flags.FLAG_REVERSE) > 0;
  };

  getTrimStart = (): number => this.trimStart;

  getTrimEnd = (): number => this.trimEnd;

  isCleanN = (): boolean => this.cleanN;

  isComplement = (): boolean => this.complement;

  isReverse = (): boolean => this.reverse;
}
