export default class Gap {
  private offset: number;

  private position: number;

  private length: number;

  constructor(position: number, length: number) {
    this.position = position;
    this.length = length;
    this.offset = -1;
  }

  getPosition = (): number => this.position;

  getOffset = (): number => this.offset;

  setOffset = (offset: number): void => {
    this.offset = offset;
  };

  getLength = (): number => this.length;

  setLength = (length: number): void => {
    this.length = length;
  };
}
