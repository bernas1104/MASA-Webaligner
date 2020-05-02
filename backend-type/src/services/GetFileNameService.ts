import path from 'path';
import fs from 'fs';

import CheckFastaFormatService from './CheckFastaFormatService';
import DownloadNCBIFileService from './DownloadNCBIFileService';
import SaveInputToFileService from './SaveInputToFileService';

import AppError from '../errors/AppError';

require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

interface GetFileNameServiceDTO {
  num: number;
  type: number;
  input?: string;
  files?: null | {
    s0input: Express.Multer.File[];
    s1input: Express.Multer.File[];
  };
}

export default class GetFileNameService {
  async execute({
    num,
    type,
    input = '',
    files = null,
  }: GetFileNameServiceDTO): Promise<string> {
    let fileName;

    const checkFastaFormatService = new CheckFastaFormatService();
    const downloadNCBIFileService = new DownloadNCBIFileService();

    switch (type) {
      case 1: {
        if (input === '') throw new AppError('Invalid NCBI Sequence ID.');

        fileName = await downloadNCBIFileService.execute({ sequence: input });

        break;
      }
      case 2: {
        const file = num === 0 ? files?.s0input : files?.s1input;

        if (file === undefined)
          throw new AppError('FASTA file was not uploaded.');

        fileName = file[0].filename;

        const filePath =
          process.env.NODE_ENV !== 'test'
            ? path.resolve(__dirname, '..', '..', 'uploads', fileName)
            : path.resolve(
                __dirname,
                '..',
                '..',
                '__tests__',
                'uploads',
                fileName,
              );

        const fileData = fs.readFileSync(filePath, 'utf-8');

        if (checkFastaFormatService.execute({ sequence: fileData }) === false)
          throw new AppError('Sequence is not FASTA type.');

        break;
      }
      case 3: {
        if (checkFastaFormatService.execute({ sequence: input }) === false)
          throw new AppError('Sequence is not FASTA type.');

        const saveInputToFileService = new SaveInputToFileService();

        fileName = saveInputToFileService.execute({ text: input });

        break;
      }
      default:
        throw new AppError('Type must be a number between 1 and 3.');
    }

    return fileName;
  }
}
