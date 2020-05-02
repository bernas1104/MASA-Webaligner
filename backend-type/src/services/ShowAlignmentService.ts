import { getRepository } from 'typeorm';

import Alignment from '../models/Alignment';
import Sequence from '../models/Sequence';

import AppError from '../errors/AppError';

interface ShowAlignmentServiceDTO {
  id: string;
}

interface ShowAlignment {
  alignment: Alignment;
  sequences: Sequence[];
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

    return { alignment, sequences };
  }
}
