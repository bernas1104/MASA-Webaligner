import { Request } from 'express';
import multer from 'multer';
import path from 'path';
import { uuid } from 'uuidv4';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  tmpFolder,
  uploadsFolder: path.resolve(__dirname, tmpFolder, 'uploads'),
  resultsFolder: path.resolve(__dirname, tmpFolder, 'results'),

  storage: multer.diskStorage({
    destination: tmpFolder,

    filename(_: Request, file, cb) {
      const id = uuid();
      const ext = path.extname(file.originalname);
      cb(null, `${id}${ext}`);
    },
  }),
};
