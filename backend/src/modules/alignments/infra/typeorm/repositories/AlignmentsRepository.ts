import { getRepository, Repository } from 'typeorm';

import IAlignmentsRepository from '@modules/alignments/repositories/IAlignmentsRepository';
import ICreateAlignmentDTO from '@modules/alignments/dtos/ICreateAlignmentDTO';
import Alignment from '../entities/Alignment';

export default class AlignmentsRepository implements IAlignmentsRepository {
  private ormRepository: Repository<Alignment>;

  constructor() {
    this.ormRepository = getRepository(Alignment);
  }

  public async create({
    extension,
    type,
    only1,
    clearn,
    block_pruning,
    complement,
    reverse,
    full_name,
    email,
  }: ICreateAlignmentDTO): Promise<Alignment> {
    const alignment = this.ormRepository.create({
      extension,
      type,
      only1,
      clearn,
      block_pruning,
      complement,
      reverse,
      full_name,
      email,
    });

    await this.ormRepository.save(alignment);

    return alignment;
  }

  public async findById(id: string): Promise<Alignment | undefined> {
    const alignment = await this.ormRepository.findOne({ where: { id } });
    return alignment;
  }

  public async updateAlignmentSituation(id: string): Promise<void> {
    const updateId = await this.ormRepository.findOneOrFail({ where: { id } });

    updateId.ready = true;

    await this.ormRepository.save(updateId);
  }
}
