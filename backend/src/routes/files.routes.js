const { Router } = require('express');

const FetchStageIResultsService = require('../services/FetchStageIResultsService');

const filesRouter = Router({ strict: true });

filesRouter.get('/stage-i/:id', async (request, response) => {
    const { id } = request.params;

    const fetchStageIResultsService = new FetchStageIResultsService();

    const bestScoreInformation = await fetchStageIResultsService.execute({ id });

    return response.json({ bestScoreInformation });
});

filesRouter.get('/bin/:id', async (request, response) => {
    const { id } = request.params;

    return response.send('2');
});

filesRouter.get('/fasta/:id', async (request, response) => {
    const { id } = request.params;

    return response.send('3');
});

module.exports = filesRouter;
