import { Router } from 'express';

import alignmentsRouter from '@modules/alignments/infra/http/routes/alignments.routes';
import filesRouter from '@modules/files/infra/http/routes/files.routes';

const routes = Router();

routes.use('/alignments', alignmentsRouter);
routes.use('/files', filesRouter);

export default routes;
