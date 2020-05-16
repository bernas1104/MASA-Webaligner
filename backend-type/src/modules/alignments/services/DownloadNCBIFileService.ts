import path from 'path';
import fs from 'fs';
import axios from 'axios';
import { uuid } from 'uuidv4';

import DeleteUploadedFileService from './DeleteUploadedFileService';

import AppError from '../errors/AppError';

require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

interface DownloadNCBIFileServiceDTO {
  sequence: string;
}

export default class DownloadNCBIFileService {
  async execute({ sequence }: DownloadNCBIFileServiceDTO): Promise<string> {
    const filePath =
      process.env.NODE_ENV !== 'test'
        ? path.resolve(__dirname, '..', '..', 'uploads', `${uuid()}.fasta`)
        : path.resolve(
            __dirname,
            '..',
            '..',
            '__tests__',
            'uploads',
            `${uuid()}.fasta`,
          );
    const writer = fs.createWriteStream(filePath);
    try {
      const response = await axios({
        url: `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=nucleotide&id=${sequence}&rettype=fasta`,
        method: 'GET',
        responseType: 'stream',
      });

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
      const deleteUploadedFileService = new DeleteUploadedFileService();
      deleteUploadedFileService.execute({ fileName: filePath });
      throw new AppError('Invalid NCBI Sequence ID.', 400);
    }
  }
}
