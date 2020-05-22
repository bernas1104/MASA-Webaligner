import AppError from '@shared/errors/AppError';
import FakeAlignmentsRepository from '../repositories/fakes/FakeAlignmentsRepository';
import FakeSequencesRepository from '../repositories/fakes/FakeSequencesRepository';

import CreateSequenceService from './CreateSequenceService';

let fakeAlignmentsRepository: FakeAlignmentsRepository;
let fakeSequencesRepository: FakeSequencesRepository;
let createSequenceService: CreateSequenceService;

describe('CreateSequence', () => {
  beforeEach(() => {
    fakeAlignmentsRepository = new FakeAlignmentsRepository();
    fakeSequencesRepository = new FakeSequencesRepository();

    createSequenceService = new CreateSequenceService(
      fakeAlignmentsRepository,
      fakeSequencesRepository,
    );
  });

  it('should create a sequence', async () => {
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

    const sequence = await createSequenceService.execute({
      file: 'Fasta Sequence Filename',
      origin: 1,
      size: 10035,
      alignment_id: id,
    });

    expect(sequence).toHaveProperty('id');
  });

  it('should not create a sequence if alignment does not exist', async () => {
    await expect(
      createSequenceService.execute({
        file: 'Fasta Sequence Filename',
        origin: 1,
        size: 10035,
        alignment_id: 'non-existing alignment_id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
