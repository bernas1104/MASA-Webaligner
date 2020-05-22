import 'reflect-metadata';

import path from 'path';
import fs from 'fs-extra';

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';

import FakeAlignmentsRepository from '../repositories/fakes/FakeAlignmentsRepository';
import FakeSequencesRepository from '../repositories/fakes/FakeSequencesRepository';

import ShowAlignmentService from './ShowAlignmentService';
import Alignment from '../infra/typeorm/entities/Alignment';

let fakeAlignmentsRepository: FakeAlignmentsRepository;
let fakeSequencesRepository: FakeSequencesRepository;
let showAlignmentService: ShowAlignmentService;

describe('ShowAlignment', () => {
  beforeAll(() => {
    fs.copySync(
      path.resolve(uploadConfig.tmpFolder, 'tests', 'cuda1'),
      path.resolve(uploadConfig.resultsFolder, 'seq1cuda1-seq2cuda1'),
    );

    fs.copySync(
      path.resolve(uploadConfig.tmpFolder, 'tests', 'cuda2'),
      path.resolve(uploadConfig.resultsFolder, 'seq1cuda2-seq2cuda2'),
    );

    fs.copySync(
      path.resolve(uploadConfig.tmpFolder, 'tests', 'open1'),
      path.resolve(uploadConfig.resultsFolder, 'seq1open1-seq2open1'),
    );

    fs.copySync(
      path.resolve(uploadConfig.tmpFolder, 'tests', 'open2'),
      path.resolve(uploadConfig.resultsFolder, 'seq1open2-seq2open2'),
    );
  });

  beforeEach(() => {
    fakeAlignmentsRepository = new FakeAlignmentsRepository();
    fakeSequencesRepository = new FakeSequencesRepository();

    showAlignmentService = new ShowAlignmentService(
      fakeAlignmentsRepository,
      fakeSequencesRepository,
    );
  });

  it('should show an cudalign all stages alignment info', async () => {
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
      alignment_id: id,
      file: 'seq1cuda1.fasta',
      size: 10035,
      origin: 1,
    });

    await fakeSequencesRepository.create({
      alignment_id: id,
      file: 'seq2cuda1.fasta',
      size: 10035,
      origin: 1,
    });

    const alignmentInfo = await showAlignmentService.execute(id);

    const { alignment, sequences, statistics } = alignmentInfo;
    const { names, globalStatistics, stageIStatistics } = statistics;

    expect(alignment).toEqual(
      expect.objectContaining({
        extension: 1,
        type: 'local',
        only1: false,
        clearn: false,
        block_pruning: true,
        complement: 0,
        reverse: 0,
        email: 'johndoe@gmail.com',
        full_name: 'John Doe',
      }),
    );

    expect(sequences).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          alignment_id: id,
          file: 'seq1cuda1.fasta',
          size: 10035,
          origin: 1,
        }),
        expect.objectContaining({
          alignment_id: id,
          file: 'seq2cuda1.fasta',
          size: 10035,
          origin: 1,
        }),
      ]),
    );

    expect(names).toEqual(
      expect.arrayContaining([
        'AF133821.1 HIV-1 isolate MB2059 from Kenya, complete genome',
        'AY352275.1 HIV-1 isolate SF33 from USA, complete genome',
      ]),
    );

    expect(globalStatistics).toEqual(
      expect.arrayContaining([
        '          START:       0.0000 (   0)  avg.:     -nan',
        '      SEQUENCES:       0.3020 (   1)  avg.:   0.3020',
        '           INIT:     296.8950 (   1)  avg.: 296.8950',
        '         STAGE1:       9.9810 (   1)  avg.:   9.9810',
        '         STAGE2:      10.2790 (   1)  avg.:  10.2790',
        '         STAGE3:       0.4500 (   1)  avg.:   0.4500',
        '         STAGE4:     199.9300 (   1)  avg.: 199.9300',
        '         STAGE5:       2.9770 (   1)  avg.:   2.9770',
        '         STAGE6:       0.9790 (   1)  avg.:   0.9790',
        '          TOTAL:     521.7930',
        '        Total: 521.7930',
        '       Matrix: 1.0316e+08',
        '        MCUPS: 197.7026',
      ]),
    );

    expect(stageIStatistics).toEqual(
      expect.arrayContaining([
        '   Best Score: 2981',
        'Best Position: (10035,10280)',
        'Stage1 times:',
        '        PREPARE:       0.3420 (   1)  avg.:   0.3420',
        '           INIT:       0.0000 (   1)  avg.:   0.0000',
        '          ALIGN:       9.0830 (   1)  avg.:   9.0830',
        '            END:       0.4110 (   1)  avg.:   0.4110',
        '          TOTAL:       9.8360',
        '        Total: 9.8360',
        '        Cells: 1.0316e+08 (1.0527e+08)',
        '        MCUPS: 10487.9824',
      ]),
    );
  });

  it('should show an cudalign only stage 1 alignment info', async () => {
    const { id } = await fakeAlignmentsRepository.create({
      extension: 1,
      type: 'local',
      only1: true,
      clearn: false,
      block_pruning: true,
      complement: 0,
      reverse: 0,
      email: 'johndoe@gmail.com',
      full_name: 'John Doe',
    });

    await fakeSequencesRepository.create({
      alignment_id: id,
      file: 'seq1cuda2.fasta',
      size: 10035,
      origin: 1,
    });

    await fakeSequencesRepository.create({
      alignment_id: id,
      file: 'seq2cuda2.fasta',
      size: 10035,
      origin: 1,
    });

    const alignmentInfo = await showAlignmentService.execute(id);

    const { alignment, sequences, statistics } = alignmentInfo;
    const { names, globalStatistics, stageIStatistics } = statistics;

    expect(alignment).toEqual(
      expect.objectContaining({
        extension: 1,
        type: 'local',
        only1: true,
        clearn: false,
        block_pruning: true,
        complement: 0,
        reverse: 0,
        email: 'johndoe@gmail.com',
        full_name: 'John Doe',
      }),
    );

    expect(sequences).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          alignment_id: id,
          file: 'seq1cuda2.fasta',
          size: 10035,
          origin: 1,
        }),
        expect.objectContaining({
          alignment_id: id,
          file: 'seq2cuda2.fasta',
          size: 10035,
          origin: 1,
        }),
      ]),
    );

    expect(names).toEqual(
      expect.arrayContaining([
        'AF133821.1 HIV-1 isolate MB2059 from Kenya, complete genome',
        'AY352275.1 HIV-1 isolate SF33 from USA, complete genome',
      ]),
    );

    expect(globalStatistics).toEqual(
      expect.arrayContaining([
        '          START:       0.0000 (   0)  avg.:     -nan',
        '      SEQUENCES:       0.2920 (   1)  avg.:   0.2920',
        '           INIT:     293.6350 (   1)  avg.: 293.6350',
        '         STAGE1:       8.9800 (   1)  avg.:   8.9800',
        '          TOTAL:     302.9070',
        '        Total: 302.9070',
        '       Matrix: 1.0316e+08',
        '        MCUPS: 340.5659',
      ]),
    );

    expect(stageIStatistics).toEqual(
      expect.arrayContaining([
        '   Best Score: 2981',
        'Best Position: (10035,10280)',
        'Stage1 times:',
        '        PREPARE:       0.3340 (   1)  avg.:   0.3340',
        '           INIT:       0.0000 (   1)  avg.:   0.0000',
        '          ALIGN:       8.2100 (   1)  avg.:   8.2100',
        '            END:       0.3390 (   1)  avg.:   0.3390',
        '          TOTAL:       8.8830',
        '        Total: 8.8830',
        '        Cells: 1.0316e+08 (1.0527e+08)',
        '        MCUPS: 11613.1719',
      ]),
    );
  });

  it('should show a masa-openmp all stages alignment info', async () => {
    const { id } = await fakeAlignmentsRepository.create({
      extension: 2,
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
      alignment_id: id,
      file: 'seq1open2.fasta',
      size: 10035,
      origin: 1,
    });

    await fakeSequencesRepository.create({
      alignment_id: id,
      file: 'seq2open2.fasta',
      size: 10035,
      origin: 1,
    });

    const alignmentInfo = await showAlignmentService.execute(id);

    const { alignment, sequences, statistics } = alignmentInfo;
    const { names, globalStatistics, stageIStatistics } = statistics;

    expect(alignment).toEqual(
      expect.objectContaining({
        extension: 2,
        type: 'local',
        only1: false,
        clearn: false,
        block_pruning: true,
        complement: 0,
        reverse: 0,
        email: 'johndoe@gmail.com',
        full_name: 'John Doe',
      }),
    );

    expect(sequences).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          alignment_id: id,
          file: 'seq1open2.fasta',
          size: 10035,
          origin: 1,
        }),
        expect.objectContaining({
          alignment_id: id,
          file: 'seq2open2.fasta',
          size: 10035,
          origin: 1,
        }),
      ]),
    );

    expect(names).toEqual(
      expect.arrayContaining([
        'AF133821.1 HIV-1 isolate MB2059 from Kenya, complete genome',
        'AY352275.1 HIV-1 isolate SF33 from USA, complete genome',
      ]),
    );

    expect(globalStatistics).toEqual(
      expect.arrayContaining([
        '          START:       0.0000 (   0)  avg.:     -nan',
        '      SEQUENCES:       0.2660 (   1)  avg.:   0.2660',
        '           INIT:       0.3950 (   1)  avg.:   0.3950',
        '         STAGE1:     109.7760 (   1)  avg.: 109.7760',
        '         STAGE2:     162.9770 (   1)  avg.: 162.9770',
        '         STAGE3:      80.4280 (   1)  avg.:  80.4280',
        '         STAGE4:       5.8730 (   1)  avg.:   5.8730',
        '         STAGE5:       1.2760 (   1)  avg.:   1.2760',
        '         STAGE6:       0.4100 (   1)  avg.:   0.4100',
        '          TOTAL:     361.4010',
        '        Total: 361.4010',
        '       Matrix: 1.0316e+08',
        '        MCUPS: 285.4442',
      ]),
    );

    expect(stageIStatistics).toEqual(
      expect.arrayContaining([
        '   Best Score: 5091',
        'Best Position: (9418,9114)',
        'Stage1 times:',
        '        PREPARE:       0.3100 (   1)  avg.:   0.3100',
        '           INIT:       0.0010 (   1)  avg.:   0.0010',
        '          ALIGN:     108.6800 (   1)  avg.: 108.6800',
        '            END:       0.6270 (   1)  avg.:   0.6270',
        '          TOTAL:     109.6180',
        '        Total: 109.6180',
        '        Cells: 1.0316e+08 (0.0000e+00)',
        '        MCUPS: 941.0845',
      ]),
    );
  });

  it('should show a masa-openmp only stage 1 alignment info', async () => {
    const { id } = await fakeAlignmentsRepository.create({
      extension: 2,
      type: 'local',
      only1: true,
      clearn: false,
      block_pruning: true,
      complement: 0,
      reverse: 0,
      email: 'johndoe@gmail.com',
      full_name: 'John Doe',
    });

    await fakeSequencesRepository.create({
      alignment_id: id,
      file: 'seq1open1.fasta',
      size: 10035,
      origin: 1,
    });

    await fakeSequencesRepository.create({
      alignment_id: id,
      file: 'seq2open1.fasta',
      size: 10035,
      origin: 1,
    });

    const alignmentInfo = await showAlignmentService.execute(id);

    const { alignment, sequences, statistics } = alignmentInfo;
    const { names, globalStatistics, stageIStatistics } = statistics;

    expect(alignment).toEqual(
      expect.objectContaining({
        extension: 2,
        type: 'local',
        only1: true,
        clearn: false,
        block_pruning: true,
        complement: 0,
        reverse: 0,
        email: 'johndoe@gmail.com',
        full_name: 'John Doe',
      }),
    );

    expect(sequences).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          alignment_id: id,
          file: 'seq1open1.fasta',
          size: 10035,
          origin: 1,
        }),
        expect.objectContaining({
          alignment_id: id,
          file: 'seq2open1.fasta',
          size: 10035,
          origin: 1,
        }),
      ]),
    );

    expect(names).toEqual(
      expect.arrayContaining([
        'AF133821.1 HIV-1 isolate MB2059 from Kenya, complete genome',
        'AY352275.1 HIV-1 isolate SF33 from USA, complete genome',
      ]),
    );

    expect(globalStatistics).toEqual(
      expect.arrayContaining([
        '          START:       0.0000 (   0)  avg.:     -nan',
        '      SEQUENCES:       0.3920 (   1)  avg.:   0.3920',
        '           INIT:       0.5520 (   1)  avg.:   0.5520',
        '         STAGE1:     110.7360 (   1)  avg.: 110.7360',
        '          TOTAL:     111.6800',
        '        Total: 111.6800',
        '       Matrix: 1.0316e+08',
        '        MCUPS: 923.7088',
      ]),
    );

    expect(stageIStatistics).toEqual(
      expect.arrayContaining([
        '   Best Score: 5091',
        'Best Position: (9418,9114)',
        'Stage1 times:',
        '        PREPARE:       0.5320 (   1)  avg.:   0.5320',
        '           INIT:       0.0010 (   1)  avg.:   0.0010',
        '          ALIGN:     108.6240 (   1)  avg.: 108.6240',
        '            END:       1.3340 (   1)  avg.:   1.3340',
        '          TOTAL:     110.4910',
        '        Total: 110.4910',
        '        Cells: 1.0316e+08 (0.0000e+00)',
        '        MCUPS: 933.6489',
      ]),
    );
  });

  it('should not show an alignment info if alignment does not exist', async () => {
    await expect(
      showAlignmentService.execute('invalid-alignment-id'),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not show an alignment info if sequences do not exist', async () => {
    const alignment = await fakeAlignmentsRepository.create({
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
      showAlignmentService.execute(alignment.id),
    ).rejects.toBeInstanceOf(AppError);
  });

  afterAll(() => {
    fs.removeSync(
      path.resolve(uploadConfig.resultsFolder, 'seq1cuda1-seq2cuda1'),
    );

    fs.removeSync(
      path.resolve(uploadConfig.resultsFolder, 'seq1cuda2-seq2cuda2'),
    );

    fs.removeSync(
      path.resolve(uploadConfig.resultsFolder, 'seq1open1-seq2open1'),
    );

    fs.removeSync(
      path.resolve(uploadConfig.resultsFolder, 'seq1open2-seq2open2'),
    );
  });
});
