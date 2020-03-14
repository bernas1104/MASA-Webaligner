const app = require('./controllers/ApplicationController');

const path = require('path');
const { exec } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
exec(`mkdir ${rootDir}/uploads ${rootDir}/results`);

app.listen(process.env.PORT || 3001);   // Utilizando a porta 3001