require('../../../src/server');
const Alignment = require('../../../src/models/Alignment');
const Sequence = require('../../../src/models/Sequence');
const sequelize = require('../../../src/database/connection');
const { uuid } = require('uuidv4');

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
    const edge = edges[Math.floor(Math.random() * 5)];
    let alignmentId;
    let beforeCount;

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

    beforeEach(async () => {
        beforeCount = await Sequence.count();
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
                edge,
                alignmentId,
            });

            const afterCount = await Sequence.count();

            const { dataValues: { id }} = await Sequence.findByPk(sequence.id);

            expect(afterCount - beforeCount).toBe(1);

            expect(id).toBe(sequence.id);
        });

        it('should not create a sequence if the \'file\' is null or does not end with \'.fasta\'', async () => {
            const files = [null, 'daksl.txt', 'asdhjl.bin', 'dsjakld.fastas']

            for(let i = 0; i < 4; i++){
                try{
                    const sequence = await Sequence.create({
                        file: files[i],
                        size,
                        origin,
                        edge,
                        alignmentId,
                    });
                } catch (err) {
                    expect(err.name).toBe('SequelizeValidationError');
                }
            }

            const afterCount = await Sequence.count();

            expect(afterCount - beforeCount).toBe(0);
        });
    });

    describe('Validates the \'size\' field', () => {
        it('should create a sequence if the \'size \' is present and is an integer', async () => {
            const sequence = await Sequence.create({
                file,
                size,
                origin,
                edge,
                alignmentId,
            });

            const afterCount = await Sequence.count();

            const { dataValues: { id } } = await Sequence.findByPk(sequence.id);

            expect(afterCount - beforeCount).toBe(1);

            expect(id).toBe(sequence.id);
        });

        it('should not create a sequence if the \'size\' is not present or is not an integer', async () => {
            const sizes = [null, '', 0, -32913, 123.213, false, {}];

            for(let i = 0; i < sizes.length; i++){
                try {
                    await Sequence.create({
                        file,
                        size: sizes[i],
                        origin,
                        edge,
                        alignmentId,
                    });
                } catch (err) {
                    expect(err.name).toBe('SequelizeValidationError');
                }
            }

            const afterCount = await Sequence.count();

            expect(afterCount - beforeCount).toBe(0);
        });
    });

    describe('Validates the \'origin\' field', () => {
        it('should create a sequence if the \'origin\' is an integer between 1 and 3', async () => {
            const sequence = await Sequence.create({
                file,
                size,
                origin,
                edge,
                alignmentId,
            });

            const afterCount = await Sequence.count();

            const { dataValues: { id } } = await Sequence.findByPk(sequence.id);

            expect(afterCount - beforeCount).toBe(1);

            expect(id).toBe(sequence.id);
        });

        it('should not create a sequence if the \'origin\' is not an integer nor is between 1 and 3', async () => {
            const origins = [null, '', {}, false, 0, 4, 241.123];

            for(let i = 0; i < origin.length; i++){
                try {
                    await Sequence.create({
                        file,
                        size,
                        origin: origins[i],
                        edge,
                        alignmentId,
                    });
                } catch (err) {
                    expect(err.name).toBe('SequelizeValidationError');
                }
            }

            const afterCount = await Sequence.count();

            expect(afterCount - beforeCount).toBe(0);
        });
    });

    describe('Validates the \'edge\' field', () => {
        it('should create a sequence if the \'edge\' is one of: 1, 2, 3, + or *', async () => {
            const sequence = await Sequence.create({
                file,
                size,
                origin,
                edge,
                alignmentId,
            });

            const afterCount = await Sequence.count();

            const { dataValues: { id } } = await Sequence.findByPk(sequence.id);

            expect(afterCount - beforeCount).toBe(1);

            expect(id).toBe(sequence.id);
        });

        it('should not create a sequence if the \'edge\' is not one of: 1, 2, 3, + or *', async () => {
            const falseEdges = [null, '', {}, false, 'a', '?', 123, 213.2123];

            for(let i = 0; i < falseEdges.length; i++){
                try {
                    await Sequence.create({
                        file,
                        size,
                        origin,
                        edge: falseEdges[i],
                        alignmentId,
                    });
                } catch (err) {
                    expect(err.name).toBe('SequelizeValidationError');
                }
            }

            const afterCount = await Sequence.count();

            expect(afterCount - beforeCount).toBe(0);
        });
    });

    describe('Validates the \'alignmentId\' Foreign Key field', () => {
        it('should create a sequence if there is a alignment to associate with it', async () => {
            const sequence = await Sequence.create({
                file,
                size,
                origin,
                edge,
                alignmentId,
            });

            const { dataValues: { id } } = await Sequence.findByPk(sequence.id);

            const afterCount = await Sequence.count();

            expect(afterCount - beforeCount).toBe(1);

            expect(id).toBe(sequence.id);
        });

        it('should not create a sequence without an alignment to associate with it', async () => {
            const alignmentIds = [null, uuid, '38192038912'];

            for(let i = 0; i < alignmentIds.length; i++){
                try {
                    await Sequence.create({
                        file,
                        size,
                        origin,
                        edge,
                    });
                } catch (err) {
                    expect(err.name).toBe('SequelizeValidationError');
                }
            }

            const afterCount = await Sequence.count();

            expect(afterCount - beforeCount).toBe(0);
        });
    });
});
