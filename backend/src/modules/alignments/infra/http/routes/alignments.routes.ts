import multer from 'multer';
import { Router } from 'express';

import uploadConfig from '@config/upload';

import validadeCreateAlignment from '../validations/validateCreateAlignment';

import AlignmentsController from '../controllers/AlignmentsController';

const alignmentsRouter = Router();
const upload = multer(uploadConfig);

const alignmentsController = new AlignmentsController();

alignmentsRouter.post(
  '/',
  upload.fields([
    { name: 's0input', maxCount: 1 },
    { name: 's1input', maxCount: 1 },
  ]),
  validadeCreateAlignment,
  alignmentsController.create,
);

alignmentsRouter.get('/:id', alignmentsController.show);

export default alignmentsRouter;
