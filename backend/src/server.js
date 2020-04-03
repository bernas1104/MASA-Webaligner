const mongoose = require('mongoose');
const path = require('path');
const { exec } = require('child_process');
const BullBoard = require('bull-board');

const Queue = require('./lib/Queue');

const rootDir = path.resolve(__dirname, '..');
exec(`mkdir ${rootDir}/uploads ${rootDir}/results`);

const app = require('./controllers/ApplicationController');

BullBoard.setQueues([Queue.masaQueue.bull, Queue.mailQueue.bull]);
app.express.use('/admin/queues', BullBoard.UI);

mongoose.connect(
    `mongodb://localhost:27017/${process.env.DB_NAME}`,
    { useNewUrlParser: true, useUnifiedTopology: true },
);

if(process.env.NODE_ENV !== 'test')
    app.express.listen(process.env.PORT || 3001);   // Utilizando a porta 3001