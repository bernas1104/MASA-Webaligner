import { Router, Request, Response } from 'express';

import CheckAlignmentsExistService from '../services/CheckAlignmentsExistService';

const alignmentsExistRouter = Router();

alignmentsExistRouter.get(
  '/:id',
  async (request: Request, response: Response) => {
    const { id } = request.params;

    const checkAlignmentsExistService = new CheckAlignmentsExistService();

    const exists = await checkAlignmentsExistService.execute({ id });

    return response.json({ exists });
  },
);

export default alignmentsExistRouter;
