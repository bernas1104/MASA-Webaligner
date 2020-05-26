import fs from 'fs';
import path from 'path';
import { inject, injectable, container } from 'tsyringe';

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';

import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import ISequenceFilesProvider from '@modules/files/providers/SequenceFilesProvider/models/ISequenceFilesProvider';

import CheckFastaFormatService from './CheckFastaFormatService';

interface IRequest {
  num: number;
  type: number;
  input?: string;
  files: {
    s0input?: Express.Multer.File[];
    s1input?: Express.Multer.File[];
  };
}

@injectable()
export default class GetFileNameService {
  constructor(
    @inject('StorageProvider')
    private storageProvider: IStorageProvider,

    @inject('SequenceFilesProvider')
    private sequeceFiles: ISequenceFilesProvider,
  ) {}

  async execute({ num, type, input = '', files }: IRequest): Promise<string> {
    let fileName;

    const checkFastaFormatService = container.resolve(CheckFastaFormatService);

    switch (type) {
      case 1: {
        if (input === '') throw new AppError('Invalid NCBI Sequence ID.');

        fileName = await this.sequeceFiles.fetchFastaFile(input);

        break;
      }
      case 2: {
        const file = num === 0 ? files.s0input : files.s1input;

        if (!file) throw new AppError('FASTA file was not uploaded');

        fileName = path.resolve(uploadConfig.tmpFolder, file[0].filename);

        const fileData = fs.readFileSync(fileName, 'utf-8');

        if (checkFastaFormatService.execute({ sequence: fileData }) === false)
          throw new AppError('Sequence is not FASTA type.');

        fileName = await this.storageProvider.saveFastaFile(file[0].filename);

        break;
      }
      case 3: {
        if (checkFastaFormatService.execute({ sequence: input }) === false)
          throw new AppError('Sequence is not FASTA type.');

        fileName = this.storageProvider.saveFastaInput(input);

        break;
      }
      default:
        throw new AppError('Type must be a number between 1 and 3.');
    }

    return fileName;
  }
}
