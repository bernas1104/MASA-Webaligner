import path from 'path';
import fs from 'fs';
import { getRepository } from 'typeorm';

import Sequence from '../models/Sequence';

require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

interface FetchBinaryResultsServiceDTO {
  id: string;
}

export default class FetchBinaryResultsService {
  public async execute({ id }: FetchBinaryResultsServiceDTO): Promise<Buffer> {
    const sequenceRepository = getRepository(Sequence);

    const sequences = await sequenceRepository.find({
      where: { alignment_id: id },
    });

    const s0 = sequences[0].file;
    const s1 = sequences[1].file;

    const folder = `${path.parse(s0).name}-${path.parse(s1).name}`;

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
