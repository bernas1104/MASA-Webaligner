import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

import uploadConfig from '../config/upload';

import validadeCreateAlignment from '../validations/validateCreateAlignment';

import GetFileNameService from '../services/GetFileNameService';
import SelectMASAExtensionService from '../services/SelectMASAExtensionService';
import CreateAlignmentService from '../services/CreateAlignmentService';
import CreateSequenceService from '../services/CreateSequenceService';
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
  async (request, response) => {
    const {
      extension,
      only1,
      clearn,
      complement,
      reverse,
      blockPruning,
      s0origin,
      s1origin,
      s0edge,
      s1edge,
      s0input,
      s1input,
      fullName,
      email,
    } = request.body;

    const getFileNameService = new GetFileNameService();

    const s0 = await getFileNameService.execute({
      num: 0,
      type: s0origin,
      input: s0input,
      files: request.files,
    });
    request.savedFiles.s0 = s0;
    const s0folder = s0 !== undefined ? s0.match(/.*[^.fasta]/g)![0] : null;

    const s1 = await getFileNameService.execute({
      num: 1,
      type: s1origin,
      input: s1input,
      files: request.files,
    });
    request.savedFiles.s1 = s1;
    const s1folder = s1 !== undefined ? s1.match(/.*[^.fasta]/g)![0] : null;

    const filesPath =
      process.env.NODE_ENV !== 'test'
        ? path.resolve(__dirname, '..', '..', 'uploads')
        : path.resolve(__dirname, '..', '..', '__tests__', 'uploads');
    const resultsPath =
      process.env.NODE_ENV !== 'test'
        ? path.resolve(__dirname, '..', '..', 'results')
        : path.resolve(__dirname, '..', '..', '__tests__', 'results');

    const createAlignmentService = new CreateAlignmentService();

    const alignment = await createAlignmentService.execute({
      extension,
      only1,
      clearn,
      complement,
      reverse,
      blockPruning,
      fullName,
      email,
    });

    const createSequenceService = new CreateSequenceService();

    const sequence0 = await createSequenceService.execute({
      file: s0,
      size: fs.statSync(path.join(filesPath, s0)).size,
      origin: s0origin,
      edge: s0edge,
      alignment_id: alignment.id,
    });

    const sequence1 = await createSequenceService.execute({
      file: s1,
      size: fs.statSync(path.join(filesPath, s1)).size,
      origin: s1origin,
      edge: s1edge,
      alignment_id: alignment.id,
    });

    const selectMASAExtensionService = new SelectMASAExtensionService();
    const masa = selectMASAExtensionService.execute({
      extension,
      filesPath,
      s0,
      s1,
    });

    masaQueue.bull.add({
      masa,
      only1,
      clearn,
      complement,
      reverse,
      blockPruning,
      s0,
      s1,
      s0edge,
      s1edge,
      fullName,
      email,
      s0folder,
      s1folder,
      filesPath,
      resultsPath,
      id: alignment.id,
    });

    return response.json({ alignment, sequence0, sequence1 });
  },
);

alignmentsRouter.get('/:id', async (request, response) => {
  const { id } = request.params;

  const showAlignmentService = new ShowAlignmentService();

  const result = await showAlignmentService.execute({ id });

  return response.json(result);
});

export default alignmentsRouter;
