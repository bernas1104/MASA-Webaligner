import { Router, Request, Response } from 'express';

import CheckAlignmentReadyService from '../services/CheckAlignmentReadyService';

const alignmentsCheckRouter = Router();

alignmentsCheckRouter.get('/', async (request: Request, response: Response) => {
  const s0 = String(request.query.s0);
  const s1 = String(request.query.s1);
  const only1 = Boolean(request.query.only1);

  const checkAlignmentReadyService = new CheckAlignmentReadyService();

  const isReady = await checkAlignmentReadyService.execute({ s0, s1, only1 });

  return response.json({ isReady });
});

export default alignmentsCheckRouter;
