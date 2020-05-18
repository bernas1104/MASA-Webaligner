import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import uploadConfig from '@config/upload';

import GetFileNameService from '@modules/files/services/GetFileNameService';
import SelectMASAExtensionService from '@modules/alignments/services/SelectMASAExtensionService';
import CreateAlignmentService from '@modules/alignments/services/CreateAlignmentService';
import CreateSequenceService from '@modules/alignments/services/CreateSequenceService';
import ShowAlignmentService from '@modules/alignments/services/ShowAlignmentService';

import BullQueueProvider from '@shared/container/providers/QueueProvider/implementations/BullQueueProvider';

export default class AlignmentsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const {
      extension,
      type,
      only1,
      clearn,
      complement,
      reverse,
      block_pruning,
      s0origin,
      s1origin,
      s0input,
      s1input,
      full_name,
      email,
    } = request.body;

    const getFileNameService = container.resolve(GetFileNameService);

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

    const createAlignmentService = container.resolve(CreateAlignmentService);

    const alignment = await createAlignmentService.execute({
      extension,
      type,
      only1,
      clearn,
      complement,
      reverse,
      block_pruning,
      full_name,
      email,
    });

    const createSequenceService = container.resolve(CreateSequenceService);

    const sequence0 = await createSequenceService.execute({
      file: s0,
      size: fs.statSync(path.resolve(uploadConfig.uploadsFolder, s0)).size,
      origin: s0origin,
      alignment_id: alignment.id,
    });

    const sequence1 = await createSequenceService.execute({
      file: s1,
      size: fs.statSync(path.resolve(uploadConfig.uploadsFolder, s1)).size,
      origin: s1origin,
      alignment_id: alignment.id,
    });

    const selectMASAExtensionService = container.resolve(
      SelectMASAExtensionService,
    );

    const masa = selectMASAExtensionService.execute({
      extension,
      s0,
      s1,
    });

    const masaQueue = container.resolve(BullQueueProvider);
    masaQueue.addMASAJob({
      masa,
      type,
      only1,
      clearn,
      block_pruning,
      complement,
      reverse,
      s0,
      s1,
    });

    return response.json({ alignment, sequence0, sequence1 });
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const showAlignmentService = container.resolve(ShowAlignmentService);

    const result = await showAlignmentService.execute(id);

    return response.json(result);
  }
}
