const express = require('express');
const multer = require('multer');
const uploadConfig = require('./config/upload');

// Controllers
const AlignmentsController = require('./controllers/AlignmentsController');
const MASAFilesController = require('./controllers/MASAFilesController');

const routes = express.Router();
const upload = multer(uploadConfig);

// Alignments Routes
routes.post('/alignments', upload.fields([{name: 's0input', maxCount: 1}, {name: 's1input', maxCount: 1}]), AlignmentsController.create);
routes.get('/alignments/:id', AlignmentsController.show);

// MASA Retrieve files Routes
routes.get('/bin/:id', MASAFilesController.fetchBinary);
routes.get('/fasta/:id', MASAFilesController.fetchFasta);

module.exports = routes;