const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const cors = require('cors');

const path = require('path');
const { exec } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
exec(`mkdir ${rootDir}/uploads ${rootDir}/results`);

const app = express();

mongoose.connect(
    'mongodb://localhost:27017/masa-webaligner',
    { useNewUrlParser: true, useUnifiedTopology: true },
);

app.use(cors());
app.use(express.json());
app.use(routes);
app.use('/results', express.static('results'));

app.listen(3001);   // Utilizando a porta 3000