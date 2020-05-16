import { Router } from 'express';

import alignmentsRouter from '@modules/alignments/infra/http/routes/alignments.routes';
import alignmentsReadyRouter from '@modules/alignments/infra/http/routes/alignmentsReady.routes';
import alignmentsExistRouter from '@modules/alignments/infra/http/routes/alignmentsExist.routes';
import filesRouter from '@modules/alignments/infra/http/routes/files.routes';

const routes = Router();

routes.use('/alignments', alignmentsRouter);
routes.use('/alignments-ready', alignmentsReadyRouter);
routes.use('/alignments-exist', alignmentsExistRouter);
routes.use('/files', filesRouter);

export default routes;
