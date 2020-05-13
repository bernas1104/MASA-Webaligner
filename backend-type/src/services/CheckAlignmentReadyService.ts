import path from 'path';
import mz from 'mz/fs';
import { getRepository } from 'typeorm';

import Alignment from '../models/Alignment';
import Sequence from '../models/Sequence';

require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

export interface CheckAlignmentReadyServiceDTO {
  id: string;
}

export default class CheckAlignmentReadyService {
  async execute({ id }: CheckAlignmentReadyServiceDTO): Promise<boolean> {
    const alignmentsRepository = getRepository(Alignment);
    const sequencesRepository = getRepository(Sequence);

    const alignment = await alignmentsRepository.findOne({ where: { id } });
    const { only1 } = alignment!;

    const [{ file: s0 }, { file: s1 }] = await sequencesRepository.find({
      where: { alignment_id: id },
    });

    let filePath =
      process.env.NODE_ENV !== 'test'
        ? path.resolve(
            __dirname,
            '..',
            '..',
            'results',
            `${path.parse(s0).name}-${path.parse(s1).name}`,
          )
        : path.resolve(
            __dirname,
            '..',
            '..',
            '__tests__',
            'results',
            `${path.parse(s0).name}-${path.parse(s1).name}`,
          );

    if (!only1) filePath = path.resolve(filePath, 'alignment.00.bin');
    else filePath = path.resolve(filePath, 'statistics_01.00');

    const isReady = await mz.exists(filePath);

    return isReady;
  }
}
