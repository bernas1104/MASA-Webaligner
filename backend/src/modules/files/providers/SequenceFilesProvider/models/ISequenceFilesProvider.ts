export default interface ISequenceFilesProvider {
  fetchFastaFile(file_id: string): Promise<string>;
}
