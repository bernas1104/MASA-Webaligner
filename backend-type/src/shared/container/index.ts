import { container } from 'tsyringe';

import '@shared/container/providers';

import IAlignmentsRepository from '@modules/alignments/repositories/IAlignmentsRepository';
import AlignmentsRepository from '@modules/alignments/infra/typeorm/repositories/AlignmentsRepository';

import ISequencesRepository from '@modules/alignments/repositories/ISequencesRepository';
import SequencesRepository from '@modules/alignments/infra/typeorm/repositories/SequencesRepository';

container.registerSingleton<IAlignmentsRepository>(
  'AlignmentsRepository',
  AlignmentsRepository,
);

container.registerSingleton<ISequencesRepository>(
  'SequencesRepository',
  SequencesRepository,
);
