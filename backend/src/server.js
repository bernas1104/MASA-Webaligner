const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');

const app = express();

mongoose.connect(
    'mongodb://localhost:27017/masa-webaligner',
    { useNewUrlParser: true, useUnifiedTopology: true },
);

app.use(express.json());
app.use(routes);

app.listen(3001);   // Utilizando a porta 3000