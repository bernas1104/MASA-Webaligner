import fs from 'fs-extra';
import path from 'path';

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import IStorageProvider from '../models/IStorageProvider';

export default class DiskStorageProvider implements IStorageProvider {
  public async saveFastaFile(file: string): Promise<string> {
    await fs.promises.rename(
      path.resolve(uploadConfig.tmpFolder, file),
      path.resolve(uploadConfig.uploadsFolder, file),
    );

    return file;
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
}
