import { container } from 'tsyringe';
import { Request, Response } from 'express';

import FetchBinaryResultsService from '../../../services/FetchBinaryResultsService';

export default class BinaryFilesController {
  public async show(request: Request, response: Response): Promise<Response> {
    const { alignment_id } = request.params;

    const fetchBinaryResultsServices = container.resolve(
      FetchBinaryResultsService,
    );

    const binaryResults = await fetchBinaryResultsServices.execute({
      alignment_id,
    });

    return response.json(binaryResults);
  }
}
