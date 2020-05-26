import SequenceModifiers from './SequenceModifiers';

interface SequenceDataArgs {
  file: string;
  modifiers: SequenceModifiers;
}

export default class SequenceData {
  private sb: string | null;

  private reverseData: number;

  private offset0: number;

  private offset1: number;

  constructor(args?: SequenceDataArgs) {
    this.reverseData = 0;
    this.offset0 = 0;
    this.offset1 = 0;

    if (!args) this.sb = null;
    else {
      const { file, modifiers } = args;

      const reader = file;

      const complement_map: string[] = new Array(256);
      for (let i = 0; i < 256; i += 1)
        complement_map[i] = String.fromCharCode(i).toUpperCase();

      if (modifiers.isComplement()) {
        complement_map[65] = 'T';
        complement_map[84] = 'A';
        complement_map[71] = 'G';
        complement_map[67] = 'C';
        complement_map[97] = 'T';
        complement_map[116] = 'A';
        complement_map[103] = 'G';
        complement_map[99] = 'C';
      }

      this.sb = '';
      for (let i = reader.indexOf('\n'); i < reader.length; i += 1) {
        if (reader[i] === '\r' || reader[i] === '\n' || reader[i] === ' ')
          continue;
        if (modifiers.isCleanN() && (reader[i] === 'N' || reader[i] === 'n'))
          continue;

        this.sb += complement_map[reader.charCodeAt(i)];
      }
    }
  }

  getSb = (): string | null => this.sb;

  setSb = (sb: string): void => {
    this.sb = sb;
  };

  getReverseData = (): number => this.reverseData;

  setReverseData = (reverseData: number): void => {
    this.reverseData = reverseData;
  };

  getOffset0 = (): number => this.offset0;

  getOffset1 = (): number => this.offset1;

  getData = (beginIndex: number, endIndex: number): string | null => {
    if (beginIndex === null && endIndex === null) {
      if (this.sb === null) return null;

      return this.sb;
    }
    if (this.sb == null || beginIndex > endIndex || beginIndex < 0) {
      const chars = new Array(endIndex - beginIndex);

      chars.fill('?');

      return chars.join('');
    }
    return this.sb.slice(beginIndex, endIndex);
  };
}
