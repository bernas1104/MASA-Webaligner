const mongoose = require('mongoose');

const path = require('path');
const { exec } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
exec(`mkdir ${rootDir}/uploads ${rootDir}/results`);

const app = require('./controllers/ApplicationController');

mongoose.connect(
    `mongodb://localhost:27017/${process.env.DB_NAME}`,
    { useNewUrlParser: true, useUnifiedTopology: true },
);

app.express.listen(process.env.PORT || 3001);   // Utilizando a porta 3001
app.server.listen(8080);                        // Utilizando a porta 8080