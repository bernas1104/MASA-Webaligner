const path = require('path');
const fs = require('fs');

const Sequence = require('../models/Sequence');

class FetchFastaFilesService {
    async execute({ id }) {
        const [{ dataValues: { file: s0 }}, { dataValues: { file: s1 }}] =
            await Sequence.findAll({ where: { alignmentId: id }});

        const filesPath = path.resolve(__dirname, '..', '..', 'uploads');

        const s0file = fs.readFileSync(path.join(filesPath, s0), 'utf-8');
        const s1file = fs.readFileSync(path.join(filesPath, s1), 'utf-8');

        return { s0file, s1file };
    }
}

module.exports = FetchFastaFilesService;
