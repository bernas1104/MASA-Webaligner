import 'reflect-metadata';

import cors from 'cors';
// import BullBoard from 'bull-board';
import { errors } from 'celebrate';
import { container } from 'tsyringe';
import express, { Request, Response, NextFunction } from 'express';

import 'express-async-errors';

import '@shared/infra/typeorm';
import '@shared/container';

import StorageProvider from '@shared/container/providers/StorageProvider/implementations/DiskStorageProvider';
import BullQueueProvider from '@shared/container/providers/QueueProvider/implementations/BullQueueProvider';
import AppError from '@shared/errors/AppError';

import routes from './routes';

const app = express();

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
    const storageProvider = container.resolve(StorageProvider);

    if (request.files) {
      let fileName;

      if (request.files.s0input) {
        fileName = request.files.s0input[0].filename;
        storageProvider.deleteFastaFile(fileName);
      }

      if (request.files.s1input) {
        fileName = request.files.s1input[0].filename;
        storageProvider.deleteFastaFile(fileName);
      }
    }

    if (request.savedFiles) {
      const { s0, s1 } = request.savedFiles;

      if (s0) storageProvider.deleteFastaFile(s0);

      if (s1) storageProvider.deleteFastaFile(s1);
    }

    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        status: 'error',
        message: err.message,
      });
    }

    console.log(err);

    return response.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  },
);

// BullBoard.setQueues([masaQueue.bull, mailQueue.bull]);
// app.use('/admin/queues', BullBoard.UI);

const queue = container.resolve(BullQueueProvider);
queue.processMASAJobs();
queue.processMailJobs();
queue.eventListnerMASA();
queue.eventListnerMail();

if (process.env.NODE_ENV !== 'test') {
  app.listen(process.env.PORT || 3334, () => {
    console.log('Server listening on port 3333... 🚀');
  });
}

module.exports = app;
