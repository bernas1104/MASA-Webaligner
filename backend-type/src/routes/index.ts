import { Router } from 'express';

import alignmentsRouter from './alignments.routes';
import alignmentsReadyRouter from './alignmentsReady.routes';
import alignmentsExistRouter from './alignmentsExist.routes';
import filesRouter from './files.routes';

const routes = Router();

routes.use('/alignments', alignmentsRouter);
routes.use('/alignments-ready', alignmentsReadyRouter);
routes.use('/alignments-exist', alignmentsExistRouter);
routes.use('/files', filesRouter);

export default routes;
