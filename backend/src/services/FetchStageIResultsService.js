const path = require('path');
const fs = require('fs');

const Sequence = require('../models/Sequence');

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

        fileData.splice(0, 11);
        fileData.splice(2, fileData.length);

        const bestScore = Number(fileData[0].match(/[0-9]+/g).join(''));
        const bestPosition = fileData[1].match(/[0-9]+/g).map(position => Number(position));

        return { bestScore, bestPosition };
    }
}

module.exports = FetchStageIResultsService;
