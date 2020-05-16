import { Request /* , Express */ } from 'express';
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  tmpFolder,
  uploadsFolder: path.resolve(__dirname, tmpFolder, 'uploads'),
  resultsFolder: path.resolve(__dirname, tmpFolder, 'results'),

  storage: multer.diskStorage({
    destination: tmpFolder,

    filename(_: Request, file, cb) {
      const fileHash = crypto.randomBytes(10).toString('HEX');
      const fileName = `${fileHash}-${file.originalname}`;

      return cb(null, fileName);
    },
  }),
  /*
  fileFilter: (req: Request, file: Express.Multer.File, cb: Function): void => {
    const ext = path.extname(file.originalname);

    if (ext !== '.fasta') {
      cb(null, false);
    }

    cb(null, true);
  },
  */
};
