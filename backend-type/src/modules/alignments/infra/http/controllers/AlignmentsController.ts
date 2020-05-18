import fs from 'fs';
import path from 'path';
import { container } from 'tsyringe';
import { Request, Response } from 'express';

import uploadConfig from '@config/upload';

import GetFileNameService from '@modules/alignments/services/GetFileNameService';
import SelectMASAExtensionService from '@modules/alignments/services/SelectMASAExtensionService';
import CreateAlignmentService from '@modules/alignments/services/CreateAlignmentService';
import CreateSequenceService from '@modules/alignments/services/CreateSequenceService';

export default class AlignmentsController {
  async create(request: Request, response: Response) {
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
    request.savedFiles = { s0 };

    const s1 = await getFileNameService.execute({
      num: 1,
      type: s1origin,
      input: s1input,
      files: request.files,
    });
    request.savedFiles = { s1 };

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
      size: fs.statSync(path.join(uploadConfig.uploadsFolder, s0)).size,
      origin: s0origin,
      edge: s0edge,
      alignment_id: alignment.id,
    });

    const sequence1 = await createSequenceService.execute({
      file: s1,
      size: fs.statSync(path.join(uploadConfig.uploadsFolder, s1)).size,
      origin: s1origin,
      edge: s1edge,
      alignment_id: alignment.id,
    });

    const selectMASAExtensionService = new SelectMASAExtensionService();
    const masa = selectMASAExtensionService.execute({
      extension,
      s0,
      s1,
    });

    return response.json({ alignment, sequence0, sequence1 });
  }
}
