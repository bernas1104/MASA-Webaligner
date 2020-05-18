import path from 'path';
import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ISequencesRepository from '@modules/alignments/repositories/ISequencesRepository';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

interface IRequest {
  alignment_id: string;
}

@injectable()
export default class FetchBinaryResultsService {
  constructor(
    @inject('SequencesRepository')
    private sequencesRepository: ISequencesRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({ alignment_id }: IRequest): Promise<Buffer> {
    const sequences = await this.sequencesRepository.findByAlignmentId(
      alignment_id,
    );

    if (sequences.length !== 2) throw new AppError('Sequences not found', 404);

    const s0 = sequences[0].file;
    const s1 = sequences[1].file;

    const folder = `${path.parse(s0).name}-${path.parse(s1).name}`;

    const file = await this.storageProvider.loadBinaryFile(folder);

    return file;
  }
}
