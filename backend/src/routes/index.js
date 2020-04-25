const { Router } = require('express');

const alignmentsRouter = require('./alignments.routes');
const filesRouter = require('./files.routes');

const routes = Router();

routes.use('/alignments', alignmentsRouter);
routes.use('/files', filesRouter);

module.exports = routes;
