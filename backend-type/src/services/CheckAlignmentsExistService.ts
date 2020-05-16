import { getRepository } from 'typeorm';
import { isUuid } from 'uuidv4';

import Alignment from '../models/Alignment';

import AppError from '../errors/AppError';

interface CheckAlignmentsExistServiceDTO {
  id: string;
}

export default class CheckAlignmentsExistService {
  public async execute({
    id,
  }: CheckAlignmentsExistServiceDTO): Promise<boolean> {
    const alignmentsRepository = getRepository(Alignment);

    if (!isUuid(id)) throw new AppError('ID must be a valid uuid type', 400);

    const alignment = await alignmentsRepository.findOne({ where: { id } });

    return !!alignment;
  }
}
