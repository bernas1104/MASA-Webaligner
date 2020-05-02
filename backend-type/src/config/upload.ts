import { Request, Express } from 'express';
import multer from 'multer';
import path from 'path';
import { uuid } from 'uuidv4';

require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

export default {
  storage: multer.diskStorage({
    destination:
      process.env.NODE_ENV !== 'test'
        ? path.resolve(__dirname, '..', '..', 'uploads')
        : path.resolve(__dirname, '..', '..', '__tests__', 'uploads'),
    filename: (req, file, cb) => {
      const id = uuid();
      const ext = path.extname(file.originalname);
      cb(null, `${id}${ext}`);
    },
  }),
  fileFilter: (req: Request, file: Express.Multer.File, cb: Function): void => {
    const ext = path.extname(file.originalname);

    if (ext !== '.fasta') {
      cb(null, false);
    }

    cb(null, true);
  },
};
