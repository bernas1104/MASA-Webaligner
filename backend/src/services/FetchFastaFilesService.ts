import path from 'path';
import fs from 'fs';

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
    const [
      {
        dataValues: { file: s0 },
      },
      {
        dataValues: { file: s1 },
      },
    ] = await Sequence.findAll({ where: { alignmentId: id } });

    const filesPath =
      process.env.NODE_ENV !== 'test'
        ? path.resolve(__dirname, '..', '..', 'uploads')
        : path.resolve(__dirname, '..', '..', '__tests__', 'uploads');

    const s0file = fs.readFileSync(path.join(filesPath, s0), 'utf-8');
    const s1file = fs.readFileSync(path.join(filesPath, s1), 'utf-8');

    return { s0file, s1file };
  }
}
