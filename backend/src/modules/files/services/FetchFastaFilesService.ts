import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ISequencesRepository from '@modules/alignments/repositories/ISequencesRepository';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

interface IRequest {
  alignment_id: string;
}

interface IFastaFiles {
  s0file: string;
  s1file: string;
}

@injectable()
export default class FetchFastaFilesService {
  constructor(
    @inject('SequencesRepository')
    private sequencesRepository: ISequencesRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({ alignment_id }: IRequest): Promise<IFastaFiles> {
    const sequences = await this.sequencesRepository.findByAlignmentId(
      alignment_id,
    );

    if (sequences.length !== 2)
      throw new AppError('Fasta files not found', 404);

    const [{ file: s0 }, { file: s1 }] = sequences;

    const { s0file, s1file } = await this.storageProvider.loadFastaFiles({
      s0Filename: s0,
      s1Filename: s1,
    });

    return { s0file, s1file };
  }
}
