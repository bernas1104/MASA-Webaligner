import { container } from 'tsyringe';

import '@shared/container/providers/queueIndex';

import IAlignmentsRepository from '@modules/alignments/repositories/IAlignmentsRepository';
import AlignmentsRepository from '@modules/alignments/infra/typeorm/repositories/AlignmentsRepository';

container.registerSingleton<IAlignmentsRepository>(
  'AlignmentsRepository',
  AlignmentsRepository,
);
