const { Router } = require('express');

const CheckAlignmentReadyService = require('./../services/CheckAlignmentReadyService');

const alignmentsCheckRouter = Router();

alignmentsCheckRouter.get('/', async (request, response) => {
    const { s0, s1, only1 } = request.query;

    const checkAlignmentReadyService = new CheckAlignmentReadyService();

    const isReady = await checkAlignmentReadyService.execute({ s0, s1, only1 });

    return response.json({ isReady });
});

module.exports = alignmentsCheckRouter;
