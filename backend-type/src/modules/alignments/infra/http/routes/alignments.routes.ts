import { Router, Request, Response } from 'express';
import multer from 'multer';

import uploadConfig from '../config/upload';

import validadeCreateAlignment from '../validations/validateCreateAlignment';

import ShowAlignmentService from '../services/ShowAlignmentService';

import { masaQueue } from '../lib/Queue';

const alignmentsRouter = Router();
const upload = multer(uploadConfig);

require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

alignmentsRouter.post(
  '/',
  upload.fields([
    { name: 's0input', maxCount: 1 },
    { name: 's1input', maxCount: 1 },
  ]),
  validadeCreateAlignment,
  ,
);

alignmentsRouter.get('/:id', async (request, response) => {
  const { id } = request.params;

  const showAlignmentService = new ShowAlignmentService();

  const result = await showAlignmentService.execute({ id });

  return response.json(result);
});

export default alignmentsRouter;
