import { uuid } from 'uuidv4';

import Sequence from '@modules/alignments/infra/typeorm/entities/Sequence';

import ISequencesRepository from '../ISequencesRepository';
import ICreateSequenceDTO from '../../dtos/ICreateSequenceDTO';

export default class FakeSequencesRepository implements ISequencesRepository {
  private sequences: Sequence[] = [];

  public async create({
    file,
    origin,
    size,
    alignment_id,
  }: ICreateSequenceDTO): Promise<Sequence> {
    const sequence = new Sequence();

    Object.assign(sequence, {
      id: uuid(),
      file,
      origin,
      size,
      alignment_id,
    });

    this.sequences.push(sequence);

    return sequence;
  }

  public async findByAlignmentId(alignment_id: string): Promise<Sequence[]> {
    const findAlignmentId: Sequence[] = [];

    this.sequences.forEach(sequence => {
      if (sequence.alignment_id === alignment_id)
        findAlignmentId.push(sequence);
    });

    return findAlignmentId;
  }
}
