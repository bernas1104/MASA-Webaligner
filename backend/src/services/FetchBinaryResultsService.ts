import path from 'path';
import fs from 'fs';

import Sequence from '../models/Sequence';

// import AppError from '../errors/AppError';

require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

interface FetchBinaryResultsServiceDTO {
  id: string;
}

export default class FetchBinaryResultsService {
  async execute({ id }: FetchBinaryResultsServiceDTO): Promise<Buffer> {
    const sequences = await Sequence.findAll({
      where: { alignmentId: id },
    });

    const s0 = sequences[0].file;
    const s1 = sequences[1].file;

    const folder = `${s0.match(/.*[^.fasta]/g)}-${s1.match(/.*[^.fasta]/g)}`;

    const filePath =
      process.env.NODE_ENV !== 'test'
        ? path.resolve(
            __dirname,
            '..',
            '..',
            'results',
            folder,
            'alignment.00.bin',
          )
        : path.resolve(
            __dirname,
            '..',
            '..',
            '__tests__',
            'results',
            folder,
            'alignment.00.bin',
          );

    const file = fs.readFileSync(filePath);

    return file;
  }
}
