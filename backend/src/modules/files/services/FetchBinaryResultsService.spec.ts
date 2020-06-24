import FakeAlignmentsRepository from '@modules/alignments/repositories/fakes/FakeAlignmentsRepository';
import FakeSequencesRepository from '@modules/alignments/repositories/fakes/FakeSequencesRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';

import AppError from '@shared/errors/AppError';
import FetchBinaryService from './FetchBinaryResultsService';

let fakeAlignmentsRepository: FakeAlignmentsRepository;
let fakeSequencesRepository: FakeSequencesRepository;
let fakeStorageProvider: FakeStorageProvider;
let fetchBinaryResults: FetchBinaryService;

describe('FetchBinaryResults', () => {
  beforeEach(() => {
    fakeAlignmentsRepository = new FakeAlignmentsRepository();
    fakeSequencesRepository = new FakeSequencesRepository();
    fakeStorageProvider = new FakeStorageProvider();

    fetchBinaryResults = new FetchBinaryService(
      fakeSequencesRepository,
      fakeStorageProvider,
    );
  });

  it('should return the binary results from the requested alignment', async () => {
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

    const binResults = await fetchBinaryResults.execute({ alignment_id: id });

    expect(binResults).toBeInstanceOf(Buffer);
  });

  it('should not return the binary results of an alignment with no sequences', async () => {
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
      fetchBinaryResults.execute({ alignment_id: id }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
