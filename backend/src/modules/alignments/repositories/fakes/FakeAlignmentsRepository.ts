import { uuid } from 'uuidv4';

import Alignment from '@modules/alignments/infra/typeorm/entities/Alignment';

import IAlignmentsRepository from '../IAlignmentsRepository';
import ICreateAlignmentDTO from '../../dtos/ICreateAlignmentDTO';

export default class FakeAlignmentsRepository implements IAlignmentsRepository {
  private alignments: Alignment[] = [];

  public async create({
    extension,
    type,
    clearn,
    only1,
    block_pruning,
    complement,
    reverse,
    full_name,
    email,
  }: ICreateAlignmentDTO): Promise<Alignment> {
    const alignment = new Alignment();

    Object.assign(alignment, {
      id: uuid(),
      extension,
      type,
      clearn,
      only1,
      block_pruning,
      complement,
      reverse,
      full_name,
      email,
    });

    this.alignments.push(alignment);

    return alignment;
  }

  public async findById(id: string): Promise<Alignment | undefined> {
    const findId = this.alignments.find(alignment => alignment.id === id);
    return findId;
  }
}
