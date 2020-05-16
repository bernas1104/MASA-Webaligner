import SequenceInfo from './SequenceInfo';
import SequenceData from './SequenceData';
import SequenceModifiers from './SequenceModifiers';

export default class Sequence {
  private info: SequenceInfo;

  private modifiers: SequenceModifiers;

  private data = new SequenceData();

  constructor(info: SequenceInfo, modifiers: SequenceModifiers) {
    this.info = info;
    this.modifiers = modifiers;
  }

  getInfo = (): SequenceInfo => this.info;

  setInfo = (info: SequenceInfo): void => {
    this.info = info;
  };

  getModifiers = (): SequenceModifiers => this.modifiers;

  setModifiers = (modifiers: SequenceModifiers): void => {
    this.modifiers = modifiers;
  };

  getData = (): SequenceData => this.data;

  setData = (data: SequenceData): void => {
    this.data = data;
  };
}
