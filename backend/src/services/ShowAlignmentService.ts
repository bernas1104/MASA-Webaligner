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
    const alignment = await Alignment.findByPk(id);

    if (!alignment) throw new AppError('Alignment not found', 400);

    const sequences = await Sequence.findAll({
      where: { alignmentId: id },
    });

    if (sequences.length !== 2) throw new AppError('Sequences not found', 400);

    return { alignment, sequences };
  }
}
