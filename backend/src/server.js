const path = require('path');
const { exec } = require('child_process');
const BullBoard = require('bull-board');
const express = require('express');
const { errors } = require('celebrate');
const cors = require('cors');
require('express-async-errors');

const sequelize = require('./database/connection');

const DeleteUploadedFileService = require('./services/DeleteUploadedFileService');

const AppError = require('./errors/AppError');

require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? ".env.test" : '.env'
});


const routes = require('./routes/index');
const Queue = require('./lib/Queue');

const rootDir = path.resolve(__dirname, '..');
exec(`mkdir ${rootDir}/uploads ${rootDir}/results`);

const app = express();

sequelize.authenticate().then(() => {
  console.log('Database connection stablished!');
}).catch(err => {
  console.log('Unable to connect to database: ', err);
});

app.use(cors());
app.use(express.json());

app.use(routes);
// app.use('/results', express.static('results')); // Why?
app.use(errors());
app.use((err, request, response, _) => {
    const deleteUploadedFileService = new DeleteUploadedFileService();

    if(request.files) {
        let fileName;

        if(request.files.s0input){
            fileName = request.files.s0input[0].filename;
            deleteUploadedFileService.execute({ fileName });
        }

        if(request.files.s1input){
            fileName = request.files.s1input[0].filename;
            deleteUploadedFileService.execute({ fileName });
        }
    }

    if(request.savedFiles) {
        const { s0, s1 } = request.savedFiles;

        if(s0) deleteUploadedFileService.execute({ fileName: s0 });

        if(s1) deleteUploadedFileService.execute({ fileName: s1 });
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
});

BullBoard.setQueues([Queue.masaQueue.bull, Queue.mailQueue.bull]);
app.use('/admin/queues', BullBoard.UI);

if (process.env.NODE_ENV !== 'test') {
  app.listen(process.env.PORT || 3334, () => {
    console.log('Server listening on port 3333... 🚀');
  });
}
