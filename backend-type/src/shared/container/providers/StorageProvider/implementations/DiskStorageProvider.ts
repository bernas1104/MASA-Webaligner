import path from 'path';
import fs from 'fs-extra';
import { uuid } from 'uuidv4';

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';

import IStorageProvider from '../models/IStorageProvider';
import ILoadFastaFiles from '../dtos/ILoadFastaFiles';
import IFastaFilesResponse from '../dtos/IFastaFilesResponse';
import IStatisticsFilesResponse from '../dtos/IStatisticsFilesResponse';

export default class DiskStorageProvider implements IStorageProvider {
  public async saveFastaFile(file: string): Promise<string> {
    await fs.promises.rename(
      path.resolve(uploadConfig.tmpFolder, file),
      path.resolve(uploadConfig.uploadsFolder, file),
    );

    return file;
  }

  public async saveFastaInput(input: string): Promise<string> {
    const filePath = path.resolve(
      uploadConfig.uploadsFolder,
      `${uuid()}.fasta`,
    );

    fs.writeFileSync(filePath, input);

    return path.basename(filePath);
  }

  public async deleteFastaFile(file: string): Promise<void> {
    const filePath = path.resolve(uploadConfig.uploadsFolder, file);

    try {
      await fs.promises.stat(filePath);
    } catch (err) {
      throw new AppError('Fasta file does not exist', 404);
    }

    await fs.promises.unlink(filePath);
  }

  public async deleteMASAResults(folder: string): Promise<void> {
    const resultsPath = path.resolve(uploadConfig.resultsFolder, folder);

    try {
      await fs.promises.access(resultsPath);
    } catch (err) {
      throw new AppError('Results folder does not exist', 404);
    }

    await fs.remove(resultsPath);
  }

  public async loadFastaFiles({
    s0Filename,
    s1Filename,
  }: ILoadFastaFiles): Promise<IFastaFilesResponse> {
    const s0file = await fs.promises.readFile(
      path.resolve(uploadConfig.uploadsFolder, s0Filename),
      'utf-8',
    );

    const s1file = await fs.promises.readFile(
      path.resolve(uploadConfig.uploadsFolder, s1Filename),
      'utf-8',
    );

    return { s0file, s1file };
  }

  public async loadBinaryFile(binFilepath: string): Promise<Buffer> {
    const binFile = await fs.promises.readFile(
      path.resolve(uploadConfig.resultsFolder, binFilepath, 'alignment.00.bin'),
    );

    return binFile;
  }

  public async loadStatisticsFiles(
    statiscsFilepath: string,
  ): Promise<IStatisticsFilesResponse> {
    const globalStatistics = await fs.promises.readFile(
      path.resolve(statiscsFilepath, 'statistics'),
      'utf-8',
    );

    const stageIStatistics = await fs.promises.readFile(
      path.resolve(statiscsFilepath, 'statistics_01.00'),
      'utf-8',
    );

    return { globalStatistics, stageIStatistics };
  }
}
