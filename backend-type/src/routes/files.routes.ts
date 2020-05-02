import { Router } from 'express';

import FetchStageIResultsService from '../services/FetchStageIResultsService';
import FetchBinaryResultsService from '../services/FetchBinaryResultsService';
import FetchFastaFilesService from '../services/FetchFastaFilesService';

const filesRouter = Router({ strict: true });

filesRouter.get('/stage-i/:id', async (request, response) => {
  const { id } = request.params;

  const fetchStageIResultsService = new FetchStageIResultsService();

  const bestScoreInformation = await fetchStageIResultsService.execute({ id });

  return response.json({ bestScoreInformation });
});

filesRouter.get('/bin/:id', async (request, response) => {
  const { id } = request.params;

  const fetchBinaryResultsServices = new FetchBinaryResultsService();

  const binaryResults = await fetchBinaryResultsServices.execute({ id });

  return response.json({ binaryResults });
});

filesRouter.get('/fasta/:id', async (request, response) => {
  const { id } = request.params;

  const fetchFastaFilesService = new FetchFastaFilesService();

  const fastaFiles = await fetchFastaFilesService.execute({ id });

  return response.json(fastaFiles);
});

export default filesRouter;
