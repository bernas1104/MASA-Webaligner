const path = require('path');
const { exec } = require('child_process');
const BullBoard = require('bull-board');
const express = require('express');
const { errors } = require('celebrate');
const cors = require('cors');

const sequelize = require('./database/connection');

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

BullBoard.setQueues([Queue.masaQueue.bull, Queue.mailQueue.bull]);
app.use('/admin/queues', BullBoard.UI);

if (process.env.NODE_ENV !== 'test') {
  app.listen(process.env.PORT || 3334, () => {
    console.log('Server listening on port 3333... 🚀');
  });
}
