import Alignment from '../models/Alignment';
import Sequence from '../models/Sequence';

import AppError from '../errors/AppError';

interface CreateSequenceServiceDTO {
  file: string;
  size: number;
  origin: string;
  edge: string;
  alignmentId: string;
}

export default class CreateSequenceService {
  async execute({
    file,
    size,
    origin,
    edge,
    alignmentId,
  }: CreateSequenceServiceDTO): Promise<Sequence> {
    const alignment = await Alignment.findByPk(alignmentId);

    if (!alignment)
      throw new AppError('There is no Alignment to attach this sequence');

    const sequence = await Sequence.create({
      file,
      size,
      origin,
      edge,
      alignmentId,
    });

    return sequence;
  }
}
