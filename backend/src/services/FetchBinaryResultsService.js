const path = require('path');
const fs = require('fs');

const Sequence = require('../models/Sequence');

class FetchBinaryResultsService {
    async execute({ id }) {
        const [{ dataValues: { file: s0 }}, { dataValues: { file: s1 }}] =
            await Sequence.findAll({ where: { alignmentId: id }});

        const folder = s0.match(/.*[^\.fasta]/g) + '-' + s1.match(/.*[^\.fasta]/g);

        const filePath = path.resolve(
            __dirname, '..', '..',
            'results', folder, 'alignment.00.bin'
        );

        const file = fs.readFileSync(filePath);

        return file;
    }
}

module.exports = FetchBinaryResultsService;
