import 'reflect-metadata';

import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';

import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeSequenceFilesProvider from '../providers/SequenceFilesProvider/fakes/FakeSequenceFilesProvider';

import GetFileNameService from './GetFileNameService';

let fakeStorageProvider: FakeStorageProvider;
let fakeSequenceFilesProvider: FakeSequenceFilesProvider;
let getFileNameService: GetFileNameService;

describe('GetFileName', () => {
  beforeEach(() => {
    fakeStorageProvider = new FakeStorageProvider();
    fakeSequenceFilesProvider = new FakeSequenceFilesProvider();

    getFileNameService = new GetFileNameService(
      fakeStorageProvider,
      fakeSequenceFilesProvider,
    );
  });

  describe('Case 1', () => {
    it('should return the name of the sequence file fetched from NCBI', async () => {
      const filename = await getFileNameService.execute({
        num: 0,
        type: 1,
        files: {
          s0input: [],
          s1input: [],
        },
        input: 'sequence-id-ncbi',
      });

      expect(filename).toContain('.fasta');
    });

    it('should not return the name if the input is empty', async () => {
      await expect(
        getFileNameService.execute({
          num: 0,
          type: 1,
          files: {
            s0input: [],
            s1input: [],
          },
        }),
      ).rejects.toBeInstanceOf(AppError);
    });
  });

  describe('Case 2', () => {
    it('should return the name of the uploaded sequence file', async () => {
      fs.copyFileSync(
        path.resolve(uploadConfig.tmpFolder, 'tests', 'AF133821.1.fasta'),
        path.resolve(uploadConfig.tmpFolder, 'AF133821.1.fasta'),
      );

      const filename = await getFileNameService.execute({
        num: 0,
        type: 2,
        files: {
          s0input: [
            {
              fieldname: 's0input',
              originalname: 'AF133821.1.fasta',
              filename: 'AF133821.1.fasta',
              encoding: 'text/plain',
              size: 10241,
              mimetype: '',
              stream: new Readable(),
              destination: '',
              path: '',
              buffer: Buffer.from(''),
            },
          ],
          s1input: [],
        },
        input: '',
      });

      expect(filename).toContain('.fasta');
    });

    it('should not return the filename if no file was uploaded', async () => {
      await expect(
        getFileNameService.execute({
          num: 0,
          type: 2,
          files: {},
          input: '',
        }),
      ).rejects.toBeInstanceOf(AppError);

      await expect(
        getFileNameService.execute({
          num: 1,
          type: 2,
          files: {},
          input: '',
        }),
      ).rejects.toBeInstanceOf(AppError);
    });

    it('should not return the file name if the uploaded file is an invalid .fasta file', async () => {
      fs.copyFileSync(
        path.resolve(uploadConfig.tmpFolder, 'tests', 'invalid1.fasta'),
        path.resolve(uploadConfig.tmpFolder, 'AF133821.1.fasta'),
      );

      await expect(
        getFileNameService.execute({
          num: 0,
          type: 2,
          files: {
            s0input: [
              {
                fieldname: 's0input',
                originalname: 'AF133821.1.fasta',
                filename: 'AF133821.1.fasta',
                encoding: 'text/plain',
                size: 10241,
                mimetype: '',
                stream: new Readable(),
                destination: '',
                path: '',
                buffer: Buffer.from(''),
              },
            ],
            s1input: [],
          },
          input: '',
        }),
      ).rejects.toBeInstanceOf(AppError);
    });
  });

  describe('Case 3', () => {
    it('it should return the filename of the inputed fasta sequence', async () => {
      const filename = await getFileNameService.execute({
        num: 0,
        type: 3,
        files: {
          s0input: [],
          s1input: [],
        },
        input: fs.readFileSync(
          path.resolve(uploadConfig.tmpFolder, 'tests', 'AF133821.1.fasta'),
          'utf-8',
        ),
      });

      expect(filename).toContain('.fasta');
    });

    it('should not return the filename if the inputed sequence is an invalid fasta sequence', async () => {
      await expect(
        getFileNameService.execute({
          num: 0,
          type: 3,
          files: {
            s0input: [],
            s1input: [],
          },
          input: '\nACGNTTAGNANCTNANGACACCATA',
        }),
      ).rejects.toBeInstanceOf(AppError);
    });
  });

  it('should not return the filename if the type is smaller than 1', async () => {
    await expect(
      getFileNameService.execute({
        num: 0,
        type: 0,
        files: {
          s0input: [],
          s1input: [],
        },
        input: '',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not return the filename if the type is bigger than 3', async () => {
    await expect(
      getFileNameService.execute({
        num: 0,
        type: 4,
        files: {
          s0input: [],
          s1input: [],
        },
        input: '',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  afterEach(() => {
    let exist = fs.existsSync(
      path.resolve(uploadConfig.uploadsFolder, 'AF133821.1.fasta'),
    );

    if (exist)
      fs.unlinkSync(
        path.resolve(uploadConfig.uploadsFolder, 'AF133821.1.fasta'),
      );

    exist = fs.existsSync(
      path.resolve(uploadConfig.tmpFolder, 'AF133821.1.fasta'),
    );

    if (exist)
      fs.unlinkSync(path.resolve(uploadConfig.tmpFolder, 'AF133821.1.fasta'));
  });
});
