const Alignment = require('../models/Alignment');
const Sequence = require('../models/Sequence');

const AppError = require('../errors/AppError');

class CreateSequenceService {
    async execute({ file, size, origin, edge, alignmentId }) {
        const alignment = await Alignment.findByPk(alignmentId);

        if(!alignment)
            throw new AppError('There is no Alignment to attach this sequence');

        const sequence = await Sequence.create({
            file,
            size,
            origin,
            edge,
            alignmentId
        });

        return sequence;
    }
}

module.exports = CreateSequenceService;
