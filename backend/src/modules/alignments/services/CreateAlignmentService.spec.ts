import FakeAlignmentsRepository from '../repositories/fakes/FakeAlignmentsRepository';

import CreateAlignmentService from './CreateAlignmentService';

let fakeAlignmentsRepository: FakeAlignmentsRepository;
let createAlignmentService: CreateAlignmentService;

describe('CreateAlignment', () => {
  beforeEach(() => {
    fakeAlignmentsRepository = new FakeAlignmentsRepository();

    createAlignmentService = new CreateAlignmentService(
      fakeAlignmentsRepository,
    );
  });

  it('should create an alignment', async () => {
    const alignment = await createAlignmentService.execute({
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

    expect(alignment).toHaveProperty('id');
  });
});
