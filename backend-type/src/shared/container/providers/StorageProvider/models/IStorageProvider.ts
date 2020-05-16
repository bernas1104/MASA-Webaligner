export default interface IStorageProvider {
  saveFastaFile(file: string): Promise<string>;
  deleteFastaFile(file: string): Promise<void>;
  deleteMASAResults(folder: string): Promise<void>;
}
