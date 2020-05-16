import IStorageProvider from '../models/IStorageProvider';

export default class FakeStorageProvider implements IStorageProvider {
  private storage: string[] = [];

  public async saveFastaFile(file: string): Promise<string> {
    this.storage.push(file);
    return file;
  }

  public async deleteFastaFile(file: string): Promise<void> {
    const idx = this.storage.findIndex(stored => stored === file);
    this.storage.splice(idx, 1);
  }

  public async deleteMASAResults(folder: string): Promise<void> {
    const idx = this.storage.findIndex(stored => stored === folder);
    this.storage.splice(idx, 1);
  }
}
