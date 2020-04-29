

const ShowAlignmentService = require(
    '../../../src/services/ShowAlignmentService'
);

const Alignment = require('../../../src/models/Alignment');
const Sequence = require('../../../src/models/Sequence');

const AppError = require('../../../src/errors/AppError');

describe('Service responsible for retrieving an alignment and it\'s sequences', () => {
    let id;

    const showAlignmentService = new ShowAlignmentService();

    beforeAll(async () => {
        await Alignment.destroy({ truncate: true, cascade: true });

        const extension = Math.floor(Math.random() * 3) + 1;

        const only1 = Math.floor(Math.random() * 2);
        const clearn = Math.floor(Math.random() * 2);
        const blockPruning = Math.floor(Math.random() * 2);

        const complement = Math.floor(Math.random() * 4);
        const reverse = Math.floor(Math.random() * 4);

        const alignment = await Alignment.create({
            extension,
            only1,
            clearn,
            blockPruning,
            complement,
            reverse,
        });

        id = alignment.id;

        const file = '8931-738739813.fasta';
        const origin = Math.floor(Math.random() * 3) + 1;
        const size = Math.floor(Math.random() * 34878913) + 1;
        const edges = ['1', '2', '3', '+', '*'];
        const edge = edges[Math.floor(Math.random() * 5)];

        for(let i = 0; i < 2; i++){
            await Sequence.create({
                file,
                origin,
                size,
                edge,
                alignmentId: id,
            });
        }
    });

    it('should return a object with the specified alignment and it\'s sequences', async () => {
        const response = await showAlignmentService.execute({ id });

        expect(response).toBeTruthy();
        expect(response.alignment instanceof Alignment).toBe(true);
        expect(response.sequences[0] instanceof Sequence).toBe(true);
        expect(response.sequences[0] instanceof Sequence).toBe(true);
    });

    it('should throw an error if the sequences are not found', async () => {
        await Sequence.destroy({ where: { alignmentId: id }});

        let error;

        try {
            await showAlignmentService.execute({ id });
        } catch (err) {
            error = err;
        }

        expect(error instanceof AppError).toBe(true);
        expect(error.message).toBe('Sequences not found');
    });

    it('should throw an error if the alignment is not found', async () => {
        await Alignment.destroy({ where: { id }});

        let error;

        try {
            await showAlignmentService.execute({ id });
        } catch (err) {
            error = err;
        }

        expect(error instanceof AppError).toBe(true);
        expect(error.message).toBe('Alignment not found');
    });

    afterAll(async () => {
        await Alignment.destroy({ truncate: true, cascade: true });
        await sequelize.close();
    });
});
