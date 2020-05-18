import { injectable, inject } from 'tsyringe';

import Sequence from '@modules/alignments/infra/typeorm/entities/Sequence';

import IAlignmentsRepository from '@modules/alignments/repositories/IAlignmentsRepository';
import ISequencesRepository from '@modules/alignments/repositories/ISequencesRepository';

import AppError from '@shared/errors/AppError';

interface IRequest {
  file: string;
  size: number;
  origin: number;
  alignment_id: string;
}

@injectable()
export default class CreateSequenceService {
  constructor(
    @inject('AlignmentsRepository')
    private alignmentsRepository: IAlignmentsRepository,

    @inject('SequencesRepository')
    private sequencesRepository: ISequencesRepository,
  ) {}

  async execute({
    file,
    size,
    origin,
    alignment_id,
  }: IRequest): Promise<Sequence> {
    const alignment = await this.alignmentsRepository.findById(alignment_id);

    if (!alignment)
      throw new AppError('There is no Alignment to attach this sequence');

    const sequence = this.sequencesRepository.create({
      file,
      size,
      origin,
      alignment_id,
    });

    return sequence;
  }
}
