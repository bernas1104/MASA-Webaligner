import TextChunk, { pad } from './TextChunk';

export default class TextChunkSum {
  score = 0;

  gapOpeningsCount = 0;

  gapExtensionsCount = 0;

  matchesCount = 0;

  mismatchesCount = 0;

  qgap = false;

  sgap = false;

  matchScore: number;

  mismatchScore: number;

  gapOpenScore: number;

  gapExtScore: number;

  constructor(
    match: number,
    mismatch: number,
    gapOpen: number,
    gapExt: number,
  ) {
    this.matchScore = match;
    this.mismatchScore = mismatch;
    this.gapOpenScore = gapOpen;
    this.gapExtScore = gapExt;
  }

  sumChunk(chunk: TextChunk): number {
    let tmp = 0;

    for (let k = 0; k < chunk.getSize(); k += 1) {
      const q = chunk.getChunk0()[k];
      const s = chunk.getChunk1()[k];

      if (q === '-') {
        if (!this.qgap) {
          tmp += this.gapOpenScore;
          this.gapOpeningsCount += 1;
        }

        tmp += this.gapExtScore;
        this.gapExtensionsCount += 1;
        this.qgap = true;
        this.sgap = false;
      } else if (s === '-') {
        if (!this.sgap) {
          tmp += this.gapOpenScore;
          this.gapOpeningsCount += 1;
        }

        tmp += this.gapExtScore;
        this.gapExtensionsCount += 1;
        this.qgap = false;
        this.sgap = true;
      } else {
        if (q === s) {
          tmp += this.matchScore;
          this.matchesCount += 1;
        } else {
          tmp += this.mismatchScore;
          this.mismatchesCount += 1;
        }

        this.qgap = false;
        this.sgap = false;
      }
    }
    this.score += tmp;
    return tmp;
  }

  getScore = (): number => this.score;

  getGapOpeningsCount = (): number => this.gapOpeningsCount;

  getGapExtensionsCount = (): number => this.gapExtensionsCount;

  getMatchesCount = (): number => this.matchesCount;

  getMismatchesCount = (): number => this.mismatchesCount;

  getMatchesScore = (): number => this.matchScore;

  getMismatchesScore = (): number => this.mismatchScore;

  getGapOpenScore = (): number => this.gapOpenScore;

  getGapExtScore = (): number => this.gapExtScore;

  getHTMLString = (): string =>
    `<div><pre>` +
    `Total Score:         ${pad(this.score, 8)}<br>` +
    `Matches:             ${pad(this.matchesCount, 8)} (+${
      this.matchScore
    })<br>` +
    `Mismatches:          ${pad(this.mismatchesCount, 8)} (${
      this.mismatchScore
    })<br>` +
    `Gap Openings:        ${pad(this.gapOpeningsCount, 8)} (${
      this.gapOpenScore
    })<br>` +
    `Gap Extensions:      ${pad(this.gapExtensionsCount, 8)} (${
      this.gapExtScore
    })<br>` +
    `</pre></div>`;
}
