import path from 'path';
import fs from 'fs';
import { getRepository } from 'typeorm';

import Sequence from '../models/Sequence';

require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

interface FetchFastaFilesServiceDTO {
  id: string;
}

interface FastaFiles {
  s0file: string;
  s1file: string;
}

export default class FetchFastaFilesService {
  async execute({ id }: FetchFastaFilesServiceDTO): Promise<FastaFiles> {
    const sequenceRepository = getRepository(Sequence);

    const [{ file: s0 }, { file: s1 }] = await sequenceRepository.find({
      where: { alignment_id: id },
    });

    const filesPath =
      process.env.NODE_ENV !== 'test'
        ? path.resolve(__dirname, '..', '..', 'uploads')
        : path.resolve(__dirname, '..', '..', '__tests__', 'uploads');

    const s0file = fs.readFileSync(path.join(filesPath, s0), 'utf-8');
    const s1file = fs.readFileSync(path.join(filesPath, s1), 'utf-8');

    return { s0file, s1file };
  }
}
