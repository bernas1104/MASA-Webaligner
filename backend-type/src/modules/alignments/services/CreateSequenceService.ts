import { getRepository } from 'typeorm';

import Alignment from '../models/Alignment';
import Sequence from '../models/Sequence';

import AppError from '../errors/AppError';

interface CreateSequenceServiceDTO {
  file: string;
  size: number;
  origin: number;
  edge: string;
  alignment_id: string;
}

export default class CreateSequenceService {
  async execute({
    file,
    size,
    origin,
    edge,
    alignment_id,
  }: CreateSequenceServiceDTO): Promise<Sequence> {
    const alignmentRepository = getRepository(Alignment);
    const sequenceRepository = getRepository(Sequence);

    const alignment = await alignmentRepository.findOne({
      where: { id: alignment_id },
    });

    if (!alignment)
      throw new AppError('There is no Alignment to attach this sequence');

    const sequence = sequenceRepository.create({
      file,
      size,
      origin,
      edge,
      alignment_id,
    });

    await sequenceRepository.save(sequence);

    return sequence;
  }
}
