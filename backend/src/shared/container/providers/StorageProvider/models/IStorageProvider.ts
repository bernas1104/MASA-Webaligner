import ILoadFastaFiles from '../dtos/ILoadFastaFiles';
import IFastaFilesResponse from '../dtos/IFastaFilesResponse';
import IStatisticsFilesResponse from '../dtos/IStatisticsFilesResponse';

export default interface IStorageProvider {
  saveFastaFile(file: string): Promise<string>;
  saveFastaInput(input: string): Promise<string>;

  deleteFastaFile(file: string): Promise<void>;
  deleteMASAResults(folder: string): Promise<void>;

  loadFastaFiles(data: ILoadFastaFiles): Promise<IFastaFilesResponse>;
  loadBinaryFile(binFilepath: string): Promise<Buffer>;
  loadStatisticsFiles(
    statiscsFilepath: string,
  ): Promise<IStatisticsFilesResponse>;
}
