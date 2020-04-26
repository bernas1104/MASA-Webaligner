const Alignment = require('../models/Alignment');

class CreateAlignmentService {
    async execute({ extension, only1, clearn,
        complement, reverse, blockPruning, fullName, email }){
        const alignment = await Alignment.create({
            extension, only1, clearn, complement, reverse, blockPruning,
            fullName, email });

        return alignment;
    }
}

module.exports = CreateAlignmentService;
