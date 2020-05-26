import { container } from 'tsyringe';
import { Request, Response } from 'express';

import FetchFastaFilesService from '../../../services/FetchFastaFilesService';

export default class FastaFilesController {
  public async show(request: Request, response: Response): Promise<Response> {
    const { alignment_id } = request.params;

    const fetchFastaFilesService = container.resolve(FetchFastaFilesService);

    const fastaFiles = await fetchFastaFilesService.execute({ alignment_id });

    return response.json(fastaFiles);
  }
}
