import fs from 'fs';
import path from 'path';
import { injectable, inject } from 'tsyringe';

import Alignment from '@modules/alignments/infra/typeorm/entities/Alignment';
import Sequence from '@modules/alignments/infra/typeorm/entities/Sequence';

import IAlignmentsRepository from '@modules/alignments/repositories/IAlignmentsRepository';
import ISequencesRepository from '@modules/alignments/repositories/ISequencesRepository';

import AppError from '@shared/errors/AppError';

import uploadConfig from '@config/upload';

interface IShowAlignment {
  alignment: Alignment;
  sequences: Sequence[];
  statistics: {
    names: string[];
    globalStatistics: string[];
    stageIStatistics: string[];
  };
}

@injectable()
export default class ShowAlignmentService {
  constructor(
    @inject('AlignmentsRepository')
    private alignmentsRepository: IAlignmentsRepository,

    @inject('SequencesRepository')
    private sequencesRepository: ISequencesRepository,
  ) {}

  async execute(id: string): Promise<IShowAlignment> {
    const alignment = await this.alignmentsRepository.findById(id);

    if (!alignment) throw new AppError('Alignment not found', 404);

    const sequences = await this.sequencesRepository.findByAlignmentId(id);

    if (sequences.length !== 2) throw new AppError('Sequences not found', 404);

    const folder = `${path.parse(sequences[0].file).name}-${
      path.parse(sequences[1].file).name
    }`;

    const resultsPath = path.resolve(uploadConfig.resultsFolder, folder);

    const names = fs
      .readFileSync(path.resolve(resultsPath, 'info'), 'utf-8')
      .split('\n')
      .map(name => name.slice(5))
      .splice(0, 2);

    let globalStatistics: string | string[] = fs
      .readFileSync(path.resolve(resultsPath, 'statistics'), 'utf-8')
      .split('\n')
      .splice(3);

    if (alignment.only1) {
      const tmp = globalStatistics.slice(0, 4);
      globalStatistics = [...tmp, ...globalStatistics.slice(9, 13)];
    }

    let stageIStatistics: string | string[] = fs.readFileSync(
      path.resolve(resultsPath, 'statistics_01.00'),
      'utf-8',
    );

    if (stageIStatistics.includes('GPU')) {
      stageIStatistics = stageIStatistics.split('\n').splice(18, 11);
    } else {
      stageIStatistics = stageIStatistics.split('\n').splice(14, 12);
    }

    const statistics = {
      names,
      globalStatistics,
      stageIStatistics,
    };

    return { alignment, sequences, statistics };
  }
}
