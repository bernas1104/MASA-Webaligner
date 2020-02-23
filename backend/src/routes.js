const express = require('express');
const multer = require('multer');
const uploadConfig = require('./config/upload');

// Controllers
const AlignmentsController = require('./controllers/AlignmentsController');
const UsersController = require('./controllers/UsersController');

const routes = express.Router();
const upload = multer(uploadConfig);

// Alignments Routes
routes.post('/alignments', upload.array('sequences', 2), AlignmentsController.create);
routes.get('/alignments/:id', AlignmentsController.show);

// Users Routes
routes.post('/users', UsersController.create);

module.exports = routes;