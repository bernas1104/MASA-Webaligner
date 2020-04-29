const { uuid } = require('uuid');

const Alignment = require('../../../src/models/Alignment');
const Sequence = require('../../../src/models/Sequence');
const sequelize = require('../../../src/database/connection');

describe('Service responsible for creating a new sequence', () => {
    const file = '8931-738739813.fasta';
    const origin = Math.floor(Math.random() * 3) + 1;
    const size = Math.floor(Math.random() * 34878913) + 1;
    const edges = ['1', '2', '3', '+', '*'];
    const edge = edges[Math.floor(Math.random() * 5)];
    let alignmentId;

    beforeAll(async () => {
        await Sequence.destroy({ truncate: true });

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

        alignmentId = alignment.id;
    });

    it('should create a sequence to the database', async () => {
        const sequence = await Sequence.create({
            file,
            origin,
            size,
            edge,
            alignmentId
        });

        const savedSequence = await Sequence.findByPk(sequence.id);

        expect(sequence.dataValues).toEqual(savedSequence.dataValues);
    });

    it('should not create a sequence if any of the parameters are missing', async () => {
        for(let i = 0; i < 5; i++){
            let error;

            try {
                await Sequence.create({
                    file: i === 0 ? null : file,
                    origin: i === 1 ? null : origin,
                    size: i === 2 ? null : size,
                    edge: i === 3 ? null : edge,
                    alignmentId: i === 4 ? null : alignmentId,
                });
            } catch (err) {
                error = new Error(err.message);
            }

            const values = ['file', 'origin', 'size', 'edge', 'alignmentId'];

            expect(error).toEqual(
                new Error(`notNull Violation: sequence.${values[i]} cannot be null`)
            );
        }
    });

    it('should not create a sequence if the given \'alignmentId\' does not match any existent alignment', async () => {
        let error;

        try {
            await Sequence.create({
                file,
                origin,
                size,
                edge,
                alignmentId: uuid(),
            });
        } catch (err) {
            error = err;
        }

        expect(error instanceof Error).toBe(true);
    });

    afterAll(async () => {
        await Alignment.destroy({ truncate: true, cascade: true });
        sequelize.close();
    });
});
