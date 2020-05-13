import GapList from './GapList';
import SequenceData from './SequenceData';

export default class SequenceWithGaps {
  private gaps: GapList;

  private endOffset: number;

  private offset: number;

  private done = true;

  private sb = '';

  constructor(sequence: SequenceData, gaps: GapList) {
    this.gaps = gaps;

    this.endOffset = 0;
    this.offset = 0;

    const start = Math.min(
      this.gaps.getStartPosition(),
      this.gaps.getEndPosition(),
    );
    const end = Math.max(
      this.gaps.getStartPosition(),
      this.gaps.getEndPosition(),
    );

    const SIZE = 1024;
    const chars = new Array(SIZE).fill('-');

    let pos = start;
    this.gaps.forEach((gap) => {
      const nextPos = gap.getPosition();
      this.sb += sequence.getData(pos - 1, nextPos - 1);
      pos = nextPos;

      let count = gap.getLength();
      while (count > 0) {
        const len = Math.min(count, SIZE);
        this.sb += chars.slice(0, len).join('');
        count -= len;
      }
    });

    this.sb += sequence.getData(pos - 1, end);
    if (this.gaps.getStartPosition() > this.gaps.getEndPosition()) {
      this.sb = this.sb.split('').reverse().join('');
    }
  }

  reset = (startOffset: number, endOffset: number): void => {
    this.offset = startOffset;
    this.endOffset = endOffset;
    this.done = false;
  };

  getCurrentPosition = (): number => this.gaps.getPosition(this.offset);

  isDone = (): boolean => this.done;

  getNextChunk = (length: number): string => {
    if (this.isDone()) {
      return '';
    }
    const nextOffset = Math.min(this.endOffset + 1, this.offset + length);

    const chunk = this.sb.slice(this.offset, nextOffset);

    if (nextOffset === this.endOffset + 1) this.done = true;

    this.offset = nextOffset;
    return chunk;
  };

  getSB = (): string => this.sb;
}
