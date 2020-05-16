export function pad(int: number, size: number): string {
  let s = String(int);
  while (s.length < (size || 2)) {
    s = ` ${s}`;
  }
  return s;
}

export default class TextChunk {
  private chunk0: string;

  private chunk1: string;

  private matchString: string;

  private i0: number;

  private i1: number;

  private j0: number;

  private j1: number;

  private size: number;

  private suffix: string;

  constructor() {
    this.chunk0 = '';
    this.chunk1 = '';
    this.matchString = '';
    this.i0 = 0;
    this.i1 = 0;
    this.j0 = 0;
    this.j1 = 0;
    this.size = 0;
    this.suffix = '';
  }

  setStartPositions = (i: number, j: number): void => {
    this.i0 = i;
    this.j0 = j;
  };

  setEndPositions = (i: number, j: number): void => {
    this.i1 = i;
    this.j1 = j;
  };

  setChunks = (chunk0: string, chunk1: string): void => {
    this.chunk0 = chunk0;
    this.chunk1 = chunk1;

    this.size = Math.min(this.chunk0.length, this.chunk1.length);
    if (this.chunk0.length !== this.chunk1.length) {
      this.chunk0 = this.chunk0.slice(0, this.size);
      this.chunk1 = this.chunk1.slice(0, this.size);
    }
  };

  getTextString = (): string => {
    return (
      `Query: ${pad(this.i0, 8)} ${this.chunk0} ${pad(this.i1, 8)}\n` +
      `                ${this.getMatchString()} ${this.suffix}\n` +
      `Sbjct: ${pad(this.j0, 8)} ${this.chunk1} ${pad(this.j1, 8)}\n`
    );
  };

  getHTMLString = (): string => {
    const c0 = this.chunk0.replace(
      /[-]/g,
      '<span style="background: #FF9090">-</span>',
    );
    const c1 = this.chunk1.replace(
      /[-]/g,
      '<span style="background: #FF9090">-</span>',
    );

    return (
      `<div><pre>` +
      `Query: ${pad(this.i0, 8)} ${c0} ${pad(this.i1, 8)}<br />` +
      `                ${this.getMatchString()} ${this.suffix}<br />` +
      `Sbjct: ${pad(this.j0, 8)} ${c1} ${pad(this.j1, 8)}<br /><br /><br />` +
      `</pre></div>`
    );
  };

  getMatchString = (): string => {
    if (this.matchString === '') {
      let sb = '';
      for (let k = 0; k < this.size; k += 1) {
        const q = this.chunk0[k];
        const s = this.chunk1[k];

        sb += q === s ? '|' : ' ';
      }

      this.matchString = sb;
    }

    return this.matchString;
  };

  getSize = (): number => this.size;

  getChunk0 = (): string => this.chunk0;

  getChunk1 = (): string => this.chunk1;

  setSuffix = (suffix: string): void => {
    this.suffix = suffix;
  };
}
