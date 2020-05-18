import IStorageProvider from '../models/IStorageProvider';
import IFastaFilesResponse from '../dtos/IFastaFilesResponse';
import IStatisticsFilesResponse from '../dtos/IStatisticsFilesResponse';

export default class FakeStorageProvider implements IStorageProvider {
  private storage: string[] = [];

  public async saveFastaFile(file: string): Promise<string> {
    this.storage.push(file);
    return file;
  }

  public async saveFastaInput(input: string): Promise<string> {
    this.storage.push(input);
    return 'filename.fasta';
  }

  public async deleteFastaFile(file: string): Promise<void> {
    const idx = this.storage.findIndex(stored => stored === file);
    this.storage.splice(idx, 1);
  }

  public async deleteMASAResults(folder: string): Promise<void> {
    const idx = this.storage.findIndex(stored => stored === folder);
    this.storage.splice(idx, 1);
  }

  public async loadFastaFiles(): Promise<IFastaFilesResponse> {
    return {
      s0file: "First file's contents",
      s1file: "Second file's contents",
    };
  }

  public async loadBinaryFile(): Promise<Buffer> {
    return Buffer.from('Binary contents');
  }

  public async loadStatisticsFiles(): Promise<IStatisticsFilesResponse> {
    return {
      globalStatistics: 'Global statiscs content',
      stageIStatistics: 'Stage I Statistics content',
    };
  }
}
