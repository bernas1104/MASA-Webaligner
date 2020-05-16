import { Router, Request, Response } from 'express';

import CheckAlignmentReadyService from '../services/CheckAlignmentReadyService';

const alignmentsReadyRouter = Router();

alignmentsReadyRouter.get(
  '/:id',
  async (request: Request, response: Response) => {
    const { id } = request.params;

    const checkAlignmentReadyService = new CheckAlignmentReadyService();

    const isReady = await checkAlignmentReadyService.execute({ id });

    return response.json({ isReady });
  },
);

export default alignmentsReadyRouter;
