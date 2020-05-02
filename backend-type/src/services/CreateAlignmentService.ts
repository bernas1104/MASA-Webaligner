import { getRepository } from 'typeorm';

import Alignment from '../models/Alignment';

interface CreateAlignmentServiceDTO {
  extension: number;
  only1?: boolean;
  clearn?: boolean;
  blockPruning?: boolean;
  complement?: number;
  reverse?: number;
  fullName?: string;
  email?: string;
}

export default class CreateAlignmentService {
  async execute({
    extension,
    only1,
    clearn,
    complement,
    reverse,
    blockPruning,
    fullName,
    email,
  }: CreateAlignmentServiceDTO): Promise<Alignment> {
    const alignmentRepository = getRepository(Alignment);

    const alignment = alignmentRepository.create({
      extension,
      only1,
      clearn,
      complement,
      reverse,
      blockPruning,
      fullName,
      email,
    });

    await alignmentRepository.save(alignment);

    return alignment;
  }
}
