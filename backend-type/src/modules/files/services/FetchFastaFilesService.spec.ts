import FakeAlignmentsRepository from '@modules/alignments/repositories/fakes/FakeAlignmentsRepository';
import FakeSequencesRepository from '@modules/alignments/repositories/fakes/FakeSequencesRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';

import AppError from '@shared/errors/AppError';
import FetchFastaFilesService from './FetchFastaFilesService';

let fakeAlignmentsRepository: FakeAlignmentsRepository;
let fakeSequencesRepository: FakeSequencesRepository;
let fakeStorageProvider: FakeStorageProvider;
let fetchFastaFiles: FetchFastaFilesService;

describe('FetchFastaFiles', () => {
  beforeEach(() => {
    fakeAlignmentsRepository = new FakeAlignmentsRepository();
    fakeSequencesRepository = new FakeSequencesRepository();
    fakeStorageProvider = new FakeStorageProvider();

    fetchFastaFiles = new FetchFastaFilesService(
      fakeSequencesRepository,
      fakeStorageProvider,
    );
  });

  it('should return the .fasta files of the requested alignment', async () => {
    const { id } = await fakeAlignmentsRepository.create({
      extension: 1,
      type: 'local',
      only1: false,
      clearn: false,
      block_pruning: true,
      complement: 0,
      reverse: 0,
      email: 'johndoe@gmail.com',
      full_name: 'John Doe',
    });

    await fakeSequencesRepository.create({
      file: 'Fasta Sequence Filename',
      origin: 1,
      size: 10035,
      alignment_id: id,
    });

    await fakeSequencesRepository.create({
      file: 'Fasta Sequence Filename',
      origin: 1,
      size: 10035,
      alignment_id: id,
    });

    const { s0file, s1file } = await fetchFastaFiles.execute({
      alignment_id: id,
    });

    expect(s0file).toEqual(expect.any(String));
    expect(s1file).toEqual(expect.any(String));
  });

  it('should not return the .fasta files of an alignment with no sequences', async () => {
    const { id } = await fakeAlignmentsRepository.create({
      extension: 1,
      type: 'local',
      only1: false,
      clearn: false,
      block_pruning: true,
      complement: 0,
      reverse: 0,
      email: 'johndoe@gmail.com',
      full_name: 'John Doe',
    });

    await expect(
      fetchFastaFiles.execute({ alignment_id: id }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
