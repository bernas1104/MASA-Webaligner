require('../../../src/server');
const Alignment = require('../../../src/models/Alignment');
const Sequence = require('../../../src/models/Sequence');
const sequelize = require('../../../src/database/connection');
const { isUuid } = require('uuidv4');

expect.extend({
    toBeInRange(received, min, max) {
        if(received >= min && received <= max){
            return {
                pass: true,
                message: () => `expected ${received} not to be between ${min} and ${max}`
            }
        } else {
            return {
                pass: false,
                message: () => `expected ${received} to be between ${min} and ${max}`
            }
        }
    },
});

describe('Sequence creating validations', () => {
    const file = '8931-738739813.fasta';
    const origin = Math.floor(Math.random() * 3) + 1;
    const size = Math.floor(Math.random() * 34878913) + 1;
    const edges = ['1', '2', '3', '+', '*'];
    let alignmentId;
    let beforeCount;

    beforeAll(async () => {
        await Sequence.destroy({ truncate: true });

        beforeCount = await Sequence.count();

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

    afterAll(async () => {
        await Alignment.destroy({ truncate: true, cascade: true });
        sequelize.close();
    });

    describe('Validates the \'file\' field', () => {
        it('should create a sequence if the \'file\' is not null and ends with \'.fasta\'', async () => {
            const sequence = await Sequence.create({
                file,
                size,
                origin,
                edge: edges[Math.floor(Math.random() * 5)],
                alignmentId,
            });

            const afterCount = await Sequence.count();

            expect(afterCount - beforeCount).toBe(1);

            expect(isUuid(sequence.id)).toBe(true);
        });

        it('', async () => {});
    });

    describe('Validates the \'size\' field', () => {
        it('', async () => {});
    });

    describe('Validates the \'origin\' field', () => {
        it('', async () => {});
    });

    describe('Validates the \'edge\' field', () => {
        it('', async () => {});
    });

    describe('Validates the \'alignmentId\' Foreign Key field', () => {
        it('', async () => {});
    });
});
