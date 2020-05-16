import Alignment from '@modules/alignments/infra/typeorm/entities/Alignment';

import ICreateAlignmentDTO from '@modules/alignments/dtos/ICreateAlignmentDTO';

export default interface IAlignmentsRepository {
  create(data: ICreateAlignmentDTO): Promise<Alignment>;
  findById(id: string): Promise<Alignment | undefined>;
}
