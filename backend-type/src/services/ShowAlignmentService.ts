import path from 'path';
import fs from 'fs';
import { getRepository } from 'typeorm';

import Alignment from '../models/Alignment';
import Sequence from '../models/Sequence';

import AppError from '../errors/AppError';

require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

interface ShowAlignmentServiceDTO {
  id: string;
}

interface ShowAlignment {
  alignment: Alignment;
  sequences: Sequence[];
  statistics: {
    names: string[];
    globalStatistics: string[];
    stageIStatistics: string[];
  };
}

export default class ShowAlignmentService {
  async execute({ id }: ShowAlignmentServiceDTO): Promise<ShowAlignment> {
    const alignmentRepository = getRepository(Alignment);
    const sequenceRepository = getRepository(Sequence);

    const alignment = await alignmentRepository.findOne({ where: { id } });

    if (!alignment) throw new AppError('Alignment not found', 400);

    const sequences = await sequenceRepository.find({
      where: { alignment_id: id },
    });

    if (sequences.length !== 2) throw new AppError('Sequences not found', 400);

    const folder = `${path.parse(sequences[0].file).name}-${
      path.parse(sequences[1].file).name
    }`;

    const filesPath =
      process.env.NODE_ENV !== 'test'
        ? path.resolve(__dirname, '..', '..', 'results', folder)
        : path.resolve(__dirname, '..', '..', '__tests__', 'results', folder);

    const names = fs
      .readFileSync(path.resolve(filesPath, 'info'), 'utf-8')
      .split('\n')
      .map(name => name.slice(5))
      .splice(0, 2);

    const globalStatistics = fs
      .readFileSync(path.resolve(filesPath, 'statistics'), 'utf-8')
      .split('\n')
      .splice(3);

    if (alignment.only1) {
      console.log(globalStatistics);
      globalStatistics.splice(4, 5);
    }

    let stageIStatistics = fs
      .readFileSync(path.resolve(filesPath, 'statistics_01.00'), 'utf-8')
      .split('\n');

    if (!alignment.only1) {
      stageIStatistics = stageIStatistics.splice(14, 10);
    } else {
      stageIStatistics = stageIStatistics.splice(11, 10);
    }

    const statistics = {
      names,
      globalStatistics,
      stageIStatistics,
    };

    return { alignment, sequences, statistics };
  }
}
