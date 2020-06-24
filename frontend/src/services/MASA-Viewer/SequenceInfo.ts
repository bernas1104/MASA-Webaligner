export default class SequenceInfo {
  static readonly SequenceType = { DNA: 1, RNA: 2, PROTEIN: 3, UNKNOWN: 255 };

  private description: string;

  private type: string;

  private size: number;

  private hash: string;

  private data: string;

  constructor() {
    this.description = '';
    this.type = '';
    this.size = 0;
    this.hash = '';
    this.data = '';
  }

  getDescription = (): string => this.description;

  setDescription = (description: string): void => {
    this.description = description;
  };

  getType = (): string => this.type;

  setType = (type: string): void => {
    this.type = type;
  };

  getSize = (): number => this.size;

  setSize = (size: number): void => {
    this.size = size;
  };

  getHash = (): string => this.hash;

  setHash = (hash: string): void => {
    this.hash = hash;
  };

  getData = (): string => this.data;

  setData = (data: string): void => {
    this.data = data;
  };

  getAccessionNumber = (): string => {
    return SequenceInfo.getAccessionNumber(this.description);
  };

  static getAccessionNumber(description: string): string {
    const tokens = description.split('\\|');
    if (tokens.length >= 3) {
      return tokens[3];
    }
    return description.split(' ')[0];
  }
}
