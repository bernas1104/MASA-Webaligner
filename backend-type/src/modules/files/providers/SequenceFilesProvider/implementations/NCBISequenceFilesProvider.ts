import fs from 'fs';
import path from 'path';
import { uuid } from 'uuidv4';
import axios, { AxiosInstance } from 'axios';
import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import uploadsConfig from '@config/upload';

import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import ISequenceFilesProvider from '../models/ISequenceFilesProvider';

@injectable()
export default class NCBISequenceFilesProvider
  implements ISequenceFilesProvider {
  private api: AxiosInstance;

  constructor(
    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {
    this.api = axios.create({
      baseURL: 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi',
    });
  }

  public async fetchFastaFile(file_id: string): Promise<string> {
    const filePath = path.resolve(
      uploadsConfig.uploadsFolder,
      `${uuid()}.fasta`,
    );

    const writer = fs.createWriteStream(filePath);

    try {
      const response = await this.api(
        `?db=nucleotide&id=${file_id}&rettype=fasta`,
        {
          method: 'GET',
          responseType: 'stream',
        },
      );

      response.data.pipe(writer);

      let name = '';
      await new Promise((resolve, reject) => {
        writer.on('finish', () => {
          name = path.basename(filePath);
          resolve();
        });
        writer.on('error', reject);
      });

      return name;
    } catch (err) {
      await this.storageProvider.deleteFastaFile(path.parse(filePath).name);
      throw new AppError('Invalid NCBI Sequence ID.', 400);
    }
  }
}
