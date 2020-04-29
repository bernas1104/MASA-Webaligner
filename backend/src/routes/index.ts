import { Router } from 'express';

import alignmentsRouter from './alignments.routes';
import alignmentsCheckRouter from './alignmentsCheck.routes';
import filesRouter from './files.routes';

const routes = Router();

routes.use('/alignments', alignmentsRouter);
routes.use('/alignments-check', alignmentsCheckRouter);
routes.use('/files', filesRouter);

export default routes;
