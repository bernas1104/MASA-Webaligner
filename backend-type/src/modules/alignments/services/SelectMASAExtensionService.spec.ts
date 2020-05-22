import 'reflect-metadata';

import fs from 'fs';
import path from 'path';

import uploadConfig from '@config/upload';
import SelectMASAExtensionService from './SelectMASAExtensionService';

let selectMASAExtension: SelectMASAExtensionService;

describe('SelectMASAExtension', () => {
  beforeAll(() => {
    fs.copyFileSync(
      path.resolve(uploadConfig.tmpFolder, 'tests', 'AF133821.1.fasta'),
      path.resolve(uploadConfig.uploadsFolder, 'AF133821.1.fasta'),
    );

    fs.copyFileSync(
      path.resolve(uploadConfig.tmpFolder, 'tests', 'AY352275.1.fasta'),
      path.resolve(uploadConfig.uploadsFolder, 'AY352275.1.fasta'),
    );

    fs.copyFileSync(
      path.resolve(uploadConfig.tmpFolder, 'tests', 'CP029532.1.fasta'),
      path.resolve(uploadConfig.uploadsFolder, 'CP029532.1.fasta'),
    );

    fs.copyFileSync(
      path.resolve(uploadConfig.tmpFolder, 'tests', 'FR796465.1.fasta'),
      path.resolve(uploadConfig.uploadsFolder, 'FR796465.1.fasta'),
    );
  });

  beforeEach(() => {
    selectMASAExtension = new SelectMASAExtensionService();
  });

  it("should return 'cudalign' if 'extension' is 1", () => {
    const masa = selectMASAExtension.execute({
      extension: 1,
      s0: 'AF133821.1.fasta',
      s1: 'AY352275.1.fasta',
    });

    expect(masa).toEqual('cudalign');
  });

  it("should return 'masa-openmp' if the 'extension' is 2", () => {
    const masa = selectMASAExtension.execute({
      extension: 2,
      s0: 'CP029532.1.fasta',
      s1: 'FR796465.1.fasta',
    });

    expect(masa).toEqual('masa-openmp');
  });

  it("should return 'masa-openmp' if 'extension' is 3 and both files are less than 1MB", () => {
    const masa = selectMASAExtension.execute({
      extension: 3,
      s0: 'AF133821.1.fasta',
      s1: 'AY352275.1.fasta',
    });

    expect(masa).toEqual('masa-openmp');
  });

  it("should return 'cudalign' if 'extension' is 3 and at least one file is bigger than 1MB", () => {
    const masa = selectMASAExtension.execute({
      extension: 3,
      s0: 'AF133821.1.fasta',
      s1: 'CP029532.1.fasta',
    });

    expect(masa).toEqual('cudalign');
  });

  afterAll(() => {
    fs.unlinkSync(path.resolve(uploadConfig.uploadsFolder, 'AF133821.1.fasta'));
    fs.unlinkSync(path.resolve(uploadConfig.uploadsFolder, 'AY352275.1.fasta'));
    fs.unlinkSync(path.resolve(uploadConfig.uploadsFolder, 'CP029532.1.fasta'));
    fs.unlinkSync(path.resolve(uploadConfig.uploadsFolder, 'FR796465.1.fasta'));
  });
});
