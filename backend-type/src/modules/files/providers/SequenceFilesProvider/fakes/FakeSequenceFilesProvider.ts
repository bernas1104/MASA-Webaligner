import ISequenceFilesProvider from '../models/ISequenceFilesProvider';

export default class FakeSequenceFilesProvider
  implements ISequenceFilesProvider {
  public async fetchFastaFile(file_id: string): Promise<string> {
    return 'Sequence Content';
  }
}
