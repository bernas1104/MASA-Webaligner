const Alignment = require('../models/Alignment');
const Sequence = require('../models/Sequence');

const AppError = require('../errors/AppError');

class ShowAlignmentService {
    async execute({ id }) {
        let alignment;

        alignment = await Alignment.findByPk(id);

        if(!alignment) throw new AppError('Alignment not found', 400);

        const sequences = await Sequence.findAll({
            where: { alignmentId: id }
        });

        if(sequences.length !== 2)
            throw new AppError('Sequences not found', 400);

        return { alignment, sequences };
    }
}

module.exports = ShowAlignmentService;
