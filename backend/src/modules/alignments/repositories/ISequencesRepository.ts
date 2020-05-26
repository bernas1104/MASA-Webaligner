import Sequence from '@modules/alignments/infra/typeorm/entities/Sequence';

import ICreateSequenceDTO from '@modules/alignments/dtos/ICreateSequenceDTO';

export default interface IAlignmentsRepository {
  create(data: ICreateSequenceDTO): Promise<Sequence>;
  findByAlignmentId(id: string): Promise<Sequence[]>;
}
