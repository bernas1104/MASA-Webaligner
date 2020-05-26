import path from 'path';
import { injectable, inject } from 'tsyringe';

import Alignment from '@modules/alignments/infra/typeorm/entities/Alignment';
import Sequence from '@modules/alignments/infra/typeorm/entities/Sequence';

import IAlignmentsRepository from '@modules/alignments/repositories/IAlignmentsRepository';
import ISequencesRepository from '@modules/alignments/repositories/ISequencesRepository';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

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

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  async execute(id: string): Promise<IShowAlignment> {
    const alignment = await this.alignmentsRepository.findById(id);

    if (!alignment) throw new AppError('Alignment not found', 404);

    if (!alignment.ready) throw new AppError('Alignment not ready', 452);

    const sequences = await this.sequencesRepository.findByAlignmentId(id);

    if (sequences.length !== 2) throw new AppError('Sequences not found', 404);

    const folder = `${path.parse(sequences[0].file).name}-${
      path.parse(sequences[1].file).name
    }`;

    const resultsPath = path.resolve(uploadConfig.resultsFolder, folder);

    const data = await this.storageProvider.loadStatisticsFiles(resultsPath);
    const { names, globalStatistics: global, stageIStatistics: stageI } = data;

    let globalStatistics = global.split('\n').splice(3);

    if (alignment.only1) {
      const tmp = globalStatistics.slice(0, 4);
      globalStatistics = [...tmp, ...globalStatistics.slice(9, 13)];
    }

    let stageIStatistics: string[];
    if (stageI.includes('GPU')) {
      stageIStatistics = stageI.split('\n').splice(18, 11);
    } else {
      stageIStatistics = stageI.split('\n').splice(14, 12);
    }

    const statistics = {
      names,
      globalStatistics,
      stageIStatistics,
    };

    return { alignment, sequences, statistics };
  }
}
