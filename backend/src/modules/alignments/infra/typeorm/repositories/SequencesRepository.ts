import { getRepository, Repository } from 'typeorm';

import ISequencesRepository from '@modules/alignments/repositories/ISequencesRepository';
import ICreateSequenceDTO from '@modules/alignments/dtos/ICreateSequenceDTO';
import Sequence from '../entities/Sequence';

export default class SequencesRepository implements ISequencesRepository {
  private ormRepository: Repository<Sequence>;

  constructor() {
    this.ormRepository = getRepository(Sequence);
  }

  public async create({
    file,
    origin,
    size,
    alignment_id,
  }: ICreateSequenceDTO): Promise<Sequence> {
    const sequence = await this.ormRepository.create({
      file,
      origin,
      size,
      alignment_id,
    });

    await this.ormRepository.save(sequence);

    return sequence;
  }

  public async findByAlignmentId(alignment_id: string): Promise<Sequence[]> {
    const sequences = await this.ormRepository.find({
      where: { alignment_id },
    });

    return sequences;
  }
}
