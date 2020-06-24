import { container } from 'tsyringe';

import '@shared/container/providers/serverIndex';

import IAlignmentsRepository from '@modules/alignments/repositories/IAlignmentsRepository';
import AlignmentsRepository from '@modules/alignments/infra/typeorm/repositories/AlignmentsRepository';

import ISequencesRepository from '@modules/alignments/repositories/ISequencesRepository';
import SequencesRepository from '@modules/alignments/infra/typeorm/repositories/SequencesRepository';

import ISequenceFilesProvider from '@modules/files/providers/SequenceFilesProvider/models/ISequenceFilesProvider';
import NCBISequenceFilesProvider from '@modules/files/providers/SequenceFilesProvider/implementations/NCBISequenceFilesProvider';

container.registerSingleton<IAlignmentsRepository>(
  'AlignmentsRepository',
  AlignmentsRepository,
);

container.registerSingleton<ISequencesRepository>(
  'SequencesRepository',
  SequencesRepository,
);

container.registerSingleton<ISequenceFilesProvider>(
  'SequenceFilesProvider',
  NCBISequenceFilesProvider,
);
