import { injectable, inject } from 'tsyringe';

import Alignment from '@modules/alignments/infra/typeorm/entities/Alignment';
import IAlignmentsRepository from '@modules/alignments/repositories/IAlignmentsRepository';

interface IRequest {
  type: string;
  extension: number;
  only1?: boolean;
  clearn?: boolean;
  block_pruning?: boolean;
  complement?: number;
  reverse?: number;
  full_name?: string;
  email?: string;
}

@injectable()
export default class CreateAlignmentService {
  constructor(
    @inject('AlignmentsRepository')
    private alignmentsRepository: IAlignmentsRepository,
  ) {}

  async execute({
    type,
    extension,
    only1,
    clearn,
    complement,
    reverse,
    block_pruning,
    full_name,
    email,
  }: IRequest): Promise<Alignment> {
    const alignment = this.alignmentsRepository.create({
      type,
      extension,
      only1,
      clearn,
      complement,
      reverse,
      block_pruning,
      full_name,
      email,
    });

    return alignment;
  }
}
