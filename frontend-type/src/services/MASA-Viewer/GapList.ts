export default class GapList extends Array {
  static readonly serialVersionUID = 1;

  private initialized = false;

  private startPosition: number;

  private endPosition: number;

  private startOffset: number;

  private endOffset: number;

  private gapsCount: number;

  constructor(length: number) {
    super();
    this.length = length;

    this.startPosition = 0;
    this.endPosition = 0;
    this.startOffset = 0;
    this.endOffset = 0;
    this.gapsCount = 0;
  }

  computeOffsets = (
    startPosition: number,
    endPosition: number,
    startOffset = 0,
  ): void => {
    if (!this.initialized) {
      this.startPosition = startPosition;
      this.endPosition = endPosition;
      this.startOffset = startOffset;

      let pos = Math.min(startPosition, endPosition);
      let offset = this.startOffset;
      this.gapsCount = 0;

      this.forEach((gap) => {
        offset += gap.getPosition() - pos;
        gap.setOffset(offset);
        offset += gap.getLength();
        this.gapsCount += gap.getLength();
        pos = gap.getPosition();
      });

      this.endOffset =
        startOffset + Math.abs(startPosition - endPosition) + this.gapsCount;
      if (this.startOffset > this.endOffset) {
        this.forEach((gap) => {
          gap.setOffset(this.endOffset - gap.getOffset() - gap.getLength());
        });
      }
      this.initialized = true;
    }
  };

  getOffset = (pos: number): number => {
    if (pos < 1) {
      pos = 1;
    } else if (pos > Math.max(this.startPosition, this.endPosition)) {
      pos = Math.max(this.startPosition, this.endPosition);
    }

    let i0 = 0;
    let i1 = this.length;

    let offset;

    if (this.length === 0 || pos < this[0].getPosition()) {
      if (this.startPosition < this.endPosition) {
        offset = this.startOffset + (pos - this.startPosition);
      } else {
        offset = this.endOffset - (pos - this.endPosition);
      }
    } else {
      while (Math.abs(i1 - i0) > 1) {
        const im = Math.floor((i0 + i1) / 2);

        const gapPos = this[im].getPosition();
        if (gapPos > pos) {
          i1 = im;
        } else if (gapPos < pos) {
          i0 = im;
        } else {
          i0 = im;
          i1 = im;
        }
      }

      let diffPos;
      if (this.startPosition < this.endPosition) {
        diffPos = pos - this[i0].getPosition();

        if (diffPos === 0) {
          offset = this[i0].getOffset();
        } else {
          offset = this[i0].getOffset() + this[i0].getLength() + diffPos;
        }
      } else {
        diffPos = pos - this[i0].getPosition();
        offset = this[i0].getOffset() - diffPos;
      }
    }

    return offset;
  };

  getPosition = (offset: number): number => this.getPositionInfo(offset)[0];

  getPositionRemainer = (offset: number): number =>
    this.getPositionInfo(offset)[1];

  getPositionInfo = (offset: number): number[] => {
    let i0 = 0;
    let i1 = this.length - 1;

    const dir = this.startPosition > this.endPosition ? -1 : +1;
    if (dir < 0) {
      const tmp = i0;
      i0 = i1;
      i1 = tmp;
    }

    let gapIndex = -1;

    let position;
    let remaining;

    if (this.length === 0 || offset < this[i0].getOffset()) {
      gapIndex = -1;
    } else if (offset > this[i1].getOffset()) {
      gapIndex = i1;
    } else {
      while (Math.abs(i1 - i0) > 1) {
        const im = Math.floor((i0 + i1) / 2);

        const gapOffset = this[im].getOffset();
        if (gapOffset > offset) {
          i1 = im;
        } else if (gapOffset < offset) {
          i0 = im;
        } else {
          i0 = im;
          i1 = im;
        }
      }
      gapIndex = i0;
    }

    if (gapIndex === -1) {
      if (dir > 0) {
        position = this.startPosition + offset;
      } else {
        position = this.startPosition - offset;
      }

      remaining = 0;
    } else {
      const diffOffset =
        offset - (this[gapIndex].getOffset() + this[gapIndex].getLength());

      if (diffOffset > 0) {
        position = this[gapIndex].getPosition() + diffOffset * dir;
        remaining = 0;
      } else {
        position = this[gapIndex].getPosition();
        remaining = -diffOffset;
      }
    }

    return [position, remaining];
  };

  getGapsCount = (): number => this.gapsCount;

  getStartPosition = (): number => this.startPosition;

  getEndPosition = (): number => this.endPosition;

  getStartOffset = (): number => this.startOffset;

  getEndOffset = (): number => this.endOffset;
}
