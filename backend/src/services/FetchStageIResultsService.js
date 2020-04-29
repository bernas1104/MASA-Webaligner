const path = require('path');
const fs = require('fs');
require('dotenv').config({
    path: process.env.NODE_ENV === 'test' ? ".env.test" : '.env'
});

// const Alignment = require('../models/Alignment');
const Sequence = require('../models/Sequence');

class FetchStageIResultsService {
    async execute({ id }) {
        // const { extension } = await Alignment.findByPk(id);

        const sequences = await Sequence.findAll({
            where: { alignmentId: id }
        });

        const s0 = sequences[0].file;
        const s1 = sequences[1].file;

        const filePath = process.env.NODE_ENV !== 'test' ?
            path.resolve(
                __dirname, '..', '..', 'results',
                path.parse(s0).name + '-' + path.parse(s1).name,
                'statistics_01.00'
            ) :
            path.resolve(
                __dirname, '..', '..', '__tests__', 'results',
                path.parse(s0).name + '-' + path.parse(s1).name,
                'statistics_01.00'
            );

        const fileData = fs.readFileSync(filePath, 'utf-8').split('\n');

        let gpu = false;
        fileData.forEach(line => {
            if(line.includes('GPU'))
                gpu = true;
        });

        if(!gpu)
            fileData.splice(0, 11);
        else
            fileData.splice(0, 15);

        fileData.splice(2, fileData.length);

        const bestScore = Number(fileData[0].match(/[0-9]+/g).join(''));
        const bestPosition = fileData[1].match(/[0-9]+/g).map(
            position => Number(position)
        );

        return { bestScore, bestPosition };
    }
}

module.exports = FetchStageIResultsService;
