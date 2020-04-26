const path = require('path');
const fs = require('fs');
require('dotenv').config({
    path: process.env.NODE_ENV === 'test' ? ".env.test" : '.env'
});

const Sequence = require('../models/Sequence');

class FetchBinaryResultsService {
    async execute({ id }) {
        const [{ dataValues: { file: s0 }}, { dataValues: { file: s1 }}] =
            await Sequence.findAll({ where: { alignmentId: id }});

        const folder = s0.match(/.*[^\.fasta]/g) + '-' + s1.match(/.*[^\.fasta]/g);

        const filePath = process.env.NODE_ENV !== 'test' ?
        path.resolve(
            __dirname, '..', '..',
            'results', folder, 'alignment.00.bin'
        ) :
        path.resolve(
            __dirname, '..', '..', '__tests__',
            'results', folder, 'alignment.00.bin'
        );

        const file = fs.readFileSync(filePath);

        return file;
    }
}

module.exports = FetchBinaryResultsService;
