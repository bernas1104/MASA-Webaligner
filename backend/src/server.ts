import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import BullBoard from 'bull-board';
import { errors } from 'celebrate';
import path from 'path';
import { exec } from 'child_process';
import 'express-async-errors';
import 'reflect-metadata';

import './database';

import DeleteUploadedFileService from './services/DeleteUploadedFileService';

import AppError from './errors/AppError';

import routes from './routes/index';
import { mailQueue, masaQueue } from './lib/Queue';

require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

const rootDir =
  process.env.NODE_ENV !== 'test'
    ? path.resolve(__dirname, '..')
    : path.resolve(__dirname, '..', '__tests__');
exec(`mkdir ${rootDir}/uploads ${rootDir}/results`);

const app = express();

// TypeORM Connection ?

app.use(cors());
app.use(express.json());

app.use(routes);
app.use(errors());
app.use(
  (
    err: Error | AppError,
    request: Request,
    response: Response,
    _: NextFunction,
  ) => {
    const deleteUploadedFileService = new DeleteUploadedFileService();

    if (request.files) {
      let fileName;

      if (request.files.s0input) {
        fileName = request.files.s0input[0].filename;
        deleteUploadedFileService.execute({ fileName });
      }

      if (request.files.s1input) {
        fileName = request.files.s1input[0].filename;
        deleteUploadedFileService.execute({ fileName });
      }
    }

    if (request.savedFiles) {
      const { s0, s1 } = request.savedFiles;

      if (s0) deleteUploadedFileService.execute({ fileName: s0 });

      if (s1) deleteUploadedFileService.execute({ fileName: s1 });
    }

    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        status: 'error',
        message: err.message,
      });
    }

    return response.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  },
);

BullBoard.setQueues([masaQueue.bull, mailQueue.bull]);
app.use('/admin/queues', BullBoard.UI);

if (process.env.NODE_ENV !== 'test') {
  app.listen(process.env.PORT || 3334, () => {
    console.log('Server listening on port 3333... 🚀');
  });
}

module.exports = app;
