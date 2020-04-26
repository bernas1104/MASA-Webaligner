const path = require('path');
const fs = require('fs');

const Sequence = require('../models/Sequence');

const GetBestScoreInformationService = require('./GetBestScoreInformationService');

class FetchStageIResultsService {
    async execute({ id }) {
        const [{ dataValues: s0} , { dataValues: s1}] = await Sequence.findAll({
             where: { alignmentId: id }
        });

        const filePath = path.resolve(
            __dirname, '..', '..', 'results',
            path.parse(s0.file).name + '-' + path.parse(s1.file).name,
            'statistics_01.00'
        );

        const fileData = fs.readFileSync(filePath, 'utf-8').split('\n');

        const getBestScoreInformation = new GetBestScoreInformationService();

        const bestScoreInformation = getBestScoreInformation.execute({
            fileData
        });

        return bestScoreInformation;
    }
}

module.exports = FetchStageIResultsService;
