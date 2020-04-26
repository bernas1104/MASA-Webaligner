const path = require('path');
const fs = require('fs');
require('dotenv').config({
    path: process.env.NODE_ENV === 'test' ? ".env.test" : '.env'
});

const Sequence = require('../models/Sequence');

class FetchStageIResultsService {
    async execute({ id }) {
        const [{ dataValues: s0} , { dataValues: s1}] = await Sequence.findAll({
             where: { alignmentId: id }
        });

        const filePath = process.env.NODE_ENV !== 'test' ?
            path.resolve(
                __dirname, '..', '..', 'results',
                path.parse(s0.file).name + '-' + path.parse(s1.file).name,
                'statistics_01.00'
            ) :
            path.resolve(
                __dirname, '..', '..', 'results', '__tests__',
                path.parse(s0.file).name + '-' + path.parse(s1.file).name,
                'statistics_01.00'
            );

        const fileData = fs.readFileSync(filePath, 'utf-8').split('\n');

        fileData.splice(0, 11);
        fileData.splice(2, fileData.length);

        const bestScore = Number(fileData[0].match(/[0-9]+/g).join(''));
        const bestPosition = fileData[1].match(/[0-9]+/g).map(
            position => Number(position)
        );

        return { bestScore, bestPosition };
    }
}

module.exports = FetchStageIResultsService;
