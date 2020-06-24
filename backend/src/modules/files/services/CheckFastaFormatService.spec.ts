import 'reflect-metadata';

import fs from 'fs';
import path from 'path';

import uploadConfig from '@config/upload';

import CheckFastaFormatService from './CheckFastaFormatService';

let checkFastaFormat: CheckFastaFormatService;
let validSequence: string;
let invalidSequence1: string;
let invalidSequence2: string;
let invalidSequence3: string;

describe('CheckFastaFormat', () => {
  beforeAll(async () => {
    validSequence = await fs.promises.readFile(
      path.resolve(uploadConfig.tmpFolder, 'tests', 'AF133821.1.fasta'),
      'utf-8',
    );

    invalidSequence1 = await fs.promises.readFile(
      path.resolve(uploadConfig.tmpFolder, 'tests', 'invalid1.fasta'),
      'utf-8',
    );

    invalidSequence2 = await fs.promises.readFile(
      path.resolve(uploadConfig.tmpFolder, 'tests', 'invalid2.fasta'),
      'utf-8',
    );

    invalidSequence3 = await fs.promises.readFile(
      path.resolve(uploadConfig.tmpFolder, 'tests', 'invalid3.fasta'),
      'utf-8',
    );
  });

  beforeEach(() => {
    checkFastaFormat = new CheckFastaFormatService();
  });

  it("should return 'true' if the sequence is a valid Fasta type", () => {
    const check = checkFastaFormat.execute({ sequence: validSequence });
    expect(check).toBe(true);
  });

  it("should return 'false' if the sequence is an invalid Fasta type (no > char)", () => {
    const check = checkFastaFormat.execute({ sequence: invalidSequence1 });
    expect(check).toBe(false);
  });

  it("should return 'false' if the sequence is an invalid Fasta type (invalid sequence chars)", () => {
    const check = checkFastaFormat.execute({ sequence: invalidSequence2 });
    expect(check).toBe(false);
  });

  it("should return 'false' if the sequence is an invalid Fasta type (no > and invalid chars)", () => {
    const check = checkFastaFormat.execute({ sequence: invalidSequence3 });
    expect(check).toBe(false);
  });
});
