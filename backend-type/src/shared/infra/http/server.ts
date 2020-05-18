import express /* , { Request, Response, NextFunction } */ from 'express';
import cors from 'cors';
// import BullBoard from 'bull-board';
// import { errors } from 'celebrate';
// import { execSync as exec } from 'child_process';
import 'express-async-errors';
import 'reflect-metadata';

import '@shared/infra/typeorm';
import '@shared/container';
// import { container } from 'tsyringe';
// import BullQueueProvider from '@shared/container/providers/QueueProvider/implementations/BullQueueProvider';
// import uploadConfig from '@config/upload';
// import AppError from '@shared/errors/AppError';

// import DeleteUploadedFileService from './services/DeleteUploadedFileService';
// import routes from './routes/index';
// import { mailQueue, masaQueue } from './lib/Queue';

require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

const app = express();

app.use(cors());
app.use(express.json());

// app.use(routes);
// app.use(errors());

/*
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
*/

/*
BullBoard.setQueues([masaQueue.bull, mailQueue.bull]);
app.use('/admin/queues', BullBoard.UI);
*/

/*
setTimeout(() => {
  const x = container.resolve(BullQueueProvider);

  x.processMailJobs();
  x.eventListnerMail();

  x.addMailJob({
    to: { name: 'Bernardo', email: 'bernardoc1104@gmail.com' },
    subject: 'Lorem Ipsum',
    template: {
      file: 'todo',
      variables: {
        lorem: 'ipsum',
      },
    },
  });
}, 5000);
*/

if (process.env.NODE_ENV !== 'test') {
  app.listen(process.env.PORT || 3334, () => {
    console.log('Server listening on port 3333... 🚀');
  });
}

module.exports = app;
