import fs from 'fs';
import path from 'path';

import uploadConfig from '@config/upload';

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
    const s0file = await fs.promises.readFile(
      path.resolve(uploadConfig.tmpFolder, 'tests', 'AF133821.1.fasta'),
      'utf-8',
    );

    const s1file = await fs.promises.readFile(
      path.resolve(uploadConfig.tmpFolder, 'tests', 'AY352275.1.fasta'),
      'utf-8',
    );

    return { s0file, s1file };
  }

  public async loadBinaryFile(): Promise<Buffer> {
    const binFile = fs.promises.readFile(
      path.resolve(uploadConfig.tmpFolder, 'tests', 'alignment.00.bin'),
    );
    return binFile;
  }

  public async loadStatisticsFiles(): Promise<IStatisticsFilesResponse> {
    return {
      globalStatistics: 'Global statiscs content',
      stageIStatistics: 'Stage I Statistics content',
    };
  }
}
