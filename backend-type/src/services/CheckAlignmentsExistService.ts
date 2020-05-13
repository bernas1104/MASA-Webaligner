import { getRepository } from 'typeorm';

import Alignment from '../models/Alignment';

interface CheckAlignmentsExistServiceDTO {
  id: string;
}

export default class CheckAlignmentsExistService {
  public async execute({
    id,
  }: CheckAlignmentsExistServiceDTO): Promise<boolean> {
    const alignmentsRepository = getRepository(Alignment);

    try {
      await alignmentsRepository.findOne({ where: { id } });
      return true;
    } catch (err) {
      return false;
    }
  }
}
