const mongoose = require('mongoose');

const Alignment = require('../../../src/models/Alignment');
const app = require('../../../src/controllers/ApplicationController');
// const server = require('./../../../src/server');

describe('Alignment creating validations', () => {
    const edges = ['*', '1', '2', '3', '+'];

    const extension = Math.floor(Math.random() * 3) + 1;

    const only1 = Math.floor(Math.random() * 2) + 1;
    
    const clearn = Math.floor(Math.random() * 2) + 1;
    const complement = Math.floor(Math.random() * 3) + 1;
    const reverse = Math.floor(Math.random() * 3) + 1;
    const blockPruning = Math.floor(Math.random() * 2) + 1;
    
    const s0type = Math.floor(Math.random() * 3) + 1;
    const s1type = Math.floor(Math.random() * 3) + 1;
    const s0edge = edges[Math.floor(Math.random() * 4)];
    const s1edge = edges[Math.floor(Math.random() * 4)];
    const s0 = 'AF133821.1.fasta';
    const s1 = 'AY352275.1.fasta';
    
    let beforeCount;

    beforeAll(async () => {
        await Alignment.deleteMany({}); // Truncates the Alignment collection
    });

    beforeEach(async () => {
        beforeCount = await Alignment.countDocuments();
    });

    afterAll(async () => {
        await Alignment.deleteMany({});
        await mongoose.disconnect();
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    describe('Validates the \'extension\' field', () => {
        it('should create an alignment if the \'extension\' field is present AND between 1 and 3', async () => {
            await Alignment.create({
                extension,
                s0type,
                s1type,
                s0,
                s1,
                s0edge,
                s1edge,
            });

            const afterCount = await Alignment.countDocuments();

            expect(afterCount - beforeCount).toBe(1);
        });

        it('should not create an alignment if the \'extension\' is not present', async () => {
            try{
                await Alignment.create({
                    s0type,
                    s1type,
                    s0,
                    s1,
                    s0edge,
                    s1edge
                });
            } catch(err) {
                expect(err.name).toBe('ValidationError');
                expect(err.errors.extension.message).toBe('Path `extension` is required.');
            }

            const afterCount = await Alignment.countDocuments();

            expect(afterCount - beforeCount).toBe(0);
        });

        it('should not create an alignment if the \'extension\' is not between 1 and 3', async () => {
            const extensions = [-5, 0, 4, 5, 120];

            for(let i = 0; i < 5; i++) {
                try{
                    await Alignment.create({
                        extension: extensions[i],
                        s0type,
                        s1type,
                        s0,
                        s1,
                        s0edge,
                        s1edge 
                    });
                } catch(err) {
                    expect(err.name).toBe('ValidationError');
                    expect(err.errors.extension.message).toBe('Must be a number between 1 and 3.');
                }
            }

            const afterCount = await Alignment.countDocuments();

            expect(afterCount - beforeCount).toBe(0);
        });
    });

    describe('Validates the \'only1\' field', () => {
        it('should create an alignment if the \'only1\' is TRUE or FALSE', async () => {
            await Alignment.create({
                extension,
                only1: only1 === 1 ? true : false,
                s0type,
                s1type,
                s0,
                s1,
                s0edge,
                s1edge
            });

            const afterCounter = await Alignment.countDocuments();

            expect(afterCounter - beforeCount).toBe(1);
        });

        it('should create an alignment if the \'only1\' is not present', async () => {
            await Alignment.create({
                extension,
                s0type,
                s1type,
                s0,
                s1,
                s0edge,
                s1edge
            });

            const afterCounter = await Alignment.countDocuments();

            expect(afterCounter - beforeCount).toBe(1);
        });

        it('should not create an alignment if the \'only1\' is not a boolean value', async () => {
            const only1s = [3, 'a', -21, 'asd'];

            for(let i = 0; i < 4; i++){
                try{
                    await Alignment.create({
                        extension,
                        only1: only1s[i],
                        s0type,
                        s1type,
                        s0,
                        s1,
                        s0edge,
                        s1edge
                    });
                } catch (err) {
                    expect(err.name).toBe('ValidationError');
                    expect(err.errors.only1.message).toBe(`Cast to Boolean failed for value "${only1s[i]}" at path "only1"`);
                }

                const afterCount = await Alignment.countDocuments();

                expect(afterCount - beforeCount).toBe(0);
            }
        });
    });

    describe('Validates the \'clearn\' field', () => {
        it('should create an alignment if the \'clearn\' is TRUE or FALSE', async () => {
            await Alignment.create({
                extension,
                clearn: clearn === 1 ? true : false,
                s0type,
                s1type,
                s0,
                s1,
                s0edge,
                s1edge,
            });

            const afterCount = await Alignment.countDocuments();

            expect(afterCount - beforeCount).toBe(1);
        });

        it('should create an alignment if the \'clearn\' is not present', async () => {
            await Alignment.create({
                extension,
                s0type,
                s1type,
                s0,
                s1,
                s0edge,
                s1edge
            });

            const afterCount = await Alignment.countDocuments();

            expect(afterCount - beforeCount).toBe(1);
        });

        it('should not create an alignment if the \'clearn\' is not a boolean value', async () => {
            const clearns = [3, 'a', -21, 'asd'];

            for(let i = 0; i < 4; i++){
                try{
                    await Alignment.create({
                        extension,
                        clearn: clearns[i],
                        s0type,
                        s1type,
                        s0,
                        s1,
                        s0edge,
                        s1edge
                    });
                } catch (err) {
                    expect(err.name).toBe('ValidationError');
                    expect(err.errors.clearn.message).toBe(`Cast to Boolean failed for value "${clearns[i]}" at path "clearn"`);
                }

                const afterCount = await Alignment.countDocuments();

                expect(afterCount - beforeCount).toBe(0);
            }
        });
    });

    describe('Validates the \'complement\' field', () => {
        it('should create an alignment if the \'complement\' is not present', async () => {
            await Alignment.create({
                extension,
                s0type,
                s1type,
                s0,
                s1,
                s0edge,
                s1edge
            });

            const afterCount = await Alignment.countDocuments();

            expect(afterCount - beforeCount).toBe(1);
        });

        it('should create an alignment if the \'complement\' field is present AND between 1 and 3', async () => {
            await Alignment.create({
                extension,
                complement,
                s0type,
                s1type,
                s0,
                s1,
                s0edge,
                s1edge
            });

            const afterCount = await Alignment.countDocuments();

            expect(afterCount - beforeCount).toBe(1);
        });

        it('should not create an alignment if the \'complement\' field is not between 1 and 3', async () => {
            const complements = [5, 'a', -12, 'ajds'];

            for(let i = 0; i < 4; i++){
                try {
                    await Alignment.create({
                        extension,
                        complement: complements[i],
                        s0type,
                        s1type,
                        s0,
                        s1,
                        s0edge,
                        s1edge
                    });
                } catch (err) {
                    expect(err.name).toBe('ValidationError');
                    
                    if(typeof(complements[i]) === 'number')
                        expect(err.errors.complement.message).toBe('Must be a number between 1 and 3.');
                    else
                        expect(err.errors.complement.message).toBe(`Cast to Number failed for value "${complements[i]}" at path "complement"`);
                }
            }

            const afterCount = await Alignment.countDocuments();

            expect(afterCount - beforeCount).toBe(0);
        });
    });

    describe('Validates the \'reverse\' field', () => {
        it('should create an alignment if the \'reverse\' field is present AND between 1 and 3', async () => {
            await Alignment.create({
                extension,
                reverse,
                s0type,
                s1type,
                s0,
                s1,
                s0edge,
                s1edge
            });

            const afterCount = await Alignment.countDocuments();

            expect(afterCount - beforeCount).toBe(1);
        });

        it('should create an alignment if the \'reverse\' field is not present', async () => {
            await Alignment.create({
                extension,
                s0type,
                s1type,
                s0,
                s1,
                s0edge,
                s1edge
            });

            const afterCount = await Alignment.countDocuments();

            expect(afterCount - beforeCount).toBe(1);
        });

        it('should not create an alignment if the \'reverse\' field is not between 1 and 3', async () => {
            const reverses = [0, 4, 'a', 'asd'];

            for(let i = 0; i < 4; i++){
                try {
                    await Alignment.create({
                        extension,
                        reverse: reverses[i],
                        s0type,
                        s1type,
                        s0,
                        s1,
                        s0edge,
                        s1edge
                    });
                } catch (err) {
                    expect(err.name).toBe('ValidationError');
                    
                    if(typeof(reverses[i]) === 'number')
                        expect(err.errors.reverse.message).toBe('Must be a number between 1 and 3.');
                    else
                        expect(err.errors.reverse.message).toBe(`Cast to Number failed for value "${reverses[i]}" at path "reverse"`);
                }
            }

            const afterCount = await Alignment.countDocuments();

            expect(afterCount - beforeCount).toBe(0);
        });
    });

    describe('Validates the \'blockPruning\' field', () => {
        it('should create an alignment if the \'blockPruning\' is present AND is TRUE or FALSE', async() => {
            await Alignment.create({
                extension,
                blockPruning: blockPruning === 1 ? true : false,
                s0type,
                s1type,
                s0,
                s1,
                s0edge,
                s1edge
            });

            const afterCount = await Alignment.countDocuments();

            expect(afterCount - beforeCount).toBe(1);
        });

        it('should create an alignment if the \'blockPruning\' is not present', async () => {
            await Alignment.create({
                extension,
                s0type,
                s1type,
                s0,
                s1,
                s0edge,
                s1edge
            });

            const afterCount = await Alignment.countDocuments();

            expect(afterCount - beforeCount).toBe(1);
        });

        it('should not create an alignment if the \'blockPruning\' is not a boolean value', async () => {
            const blockPrunings = [2, 'a', [], {}];

            for(let i = 0; i < 4; i++){
                try{
                    await Alignment.create({
                        extension,
                        blockPruning: blockPrunings[i],
                        s0type,
                        s1type,
                        s0,
                        s1,
                        s0edge,
                        s1edge
                    });
                } catch (err) {
                    expect(err.name).toBe('ValidationError');
                }
            }

            const afterCount = await Alignment.countDocuments();

            expect(afterCount - beforeCount).toBe(0);
        });
    });

    describe('Validates the \'s0type\' field', () => {
        it('should create an alignment if the `s0type` field is present AND between 1 and 3', async () => {
            await Alignment.create({
                extension,
                s0type,
                s1type,
                s0,
                s1,
                s0edge,
                s1edge
            });

            const afterCount = await Alignment.countDocuments();

            expect(afterCount - beforeCount).toBe(1);
        });

        it('should not create an alignment if the `s0type` field is not present', async () => {
            try {
                await Alignment.create({
                    extension,
                    s1type,
                    s0,
                    s1,
                    s0edge,
                    s1edge
                });
            } catch(err) {
                expect(err.name).toBe('ValidationError');
                expect(err.errors.s0type.message).toBe('Path `s0type` is required.');
            }

            const afterCount = await Alignment.countDocuments();

            expect(afterCount - beforeCount).toBe(0);
        });

        it('should not create and alignment if the `s0type` field is not between 1 and 3', async () => {
            const s0types = [-21, 0, 4, 12, 94];

            for(let i = 0; i < 5; i++) {
                try {
                    await Alignment.create({
                        extension,
                        s0type: s0types[i],
                        s1type,
                        s0,
                        s1,
                        s0edge,
                        s1edge
                    });
                } catch (err) {
                    expect(err.name).toBe('ValidationError');
                    expect(err.errors.s0type.message).toBe('Must be a number between 1 and 3.');
                }
            }

            const afterCount = await Alignment.countDocuments();

            expect(afterCount - beforeCount).toBe(0);
        });
    });

    describe('Validates the \'s1type\' field', () => {
        it('should create an alignment if the `s1type` field is present AND between 1 and 3', async () => {
            await Alignment.create({
                extension,
                s0type,
                s1type,
                s0,
                s1,
                s0edge,
                s1edge
            });

            const afterCount = await Alignment.countDocuments();

            expect(afterCount - beforeCount).toBe(1);
        });

        it('should not create an alignment if the `s1type` is not present', async () => {
            try {
                await Alignment.create({
                    extension,
                    s0type,
                    s0,
                    s1,
                    s0edge,
                    s1edge
                });
            } catch (err) {
                expect(err.name).toBe('ValidationError');
                expect(err.errors.s1type.message).toBe('Path `s1type` is required.');
            }

            const afterCount = await Alignment.countDocuments();

            expect(afterCount - beforeCount).toBe(0);
        });

        it('should not create an alignment if the `s1type` is not between 1 and 3', async () => {
            const s1types = [-31, 0, 4, 48, 129];

            for(let i = 0; i < 5; i++) {
                try {
                    await Alignment.create({
                        extension,
                        s0type,
                        s1type: s1types[i],
                        s0,
                        s1,
                        s0edge,
                        s1edge
                    });
                } catch (err) {
                    expect(err.name).toBe('ValidationError');
                    expect(err.errors.s1type.message).toBe('Must be a number between 1 and 3.');
                }
            }

            const afterCount = await Alignment.countDocuments();

            expect(afterCount - beforeCount).toBe(0);
        });
    });

    describe('Validates the `s0` field', () => {
        it('should create an alignment if the `s0` field is present', async () => {
            await Alignment.create({
                extension,
                s0type,
                s1type,
                s0,
                s1,
                s0edge,
                s1edge
            });

            const afterCount = await Alignment.countDocuments();

            expect(afterCount - beforeCount).toBe(1);
        });

        it('should not create an alignment if the `s0` field is not present', async () => {
            try {
                await Alignment.create({
                    extension,
                    s0type,
                    s1type,
                    s1,
                    s0edge,
                    s1edge
                });
            } catch (err) {
                expect(err.name).toBe('ValidationError');
                expect(err.errors.s0.message).toBe('Path `s0` is required.');
            }

            const afterCount = await Alignment.countDocuments();

            expect(afterCount - beforeCount).toBe(0);
        });
    });

    describe('Validates the `s1` field', () => {
        it('should create an alignment if the `s1` is present', async () => {
            await Alignment.create({
                extension,
                s0type,
                s1type,
                s0,
                s1,
                s0edge,
                s1edge
            });

            const afterCount = await Alignment.countDocuments();

            expect(afterCount - beforeCount).toBe(1);
        });

        it('should not create an alingment if the `s1` is not present', async () => {
            try {
                await Alignment.create({
                    extension,
                    s0type,
                    s1type,
                    s0,
                    s0edge,
                    s1edge
                });
            } catch (err) {
                expect(err.name).toBe('ValidationError');
                expect(err.errors.s1.message).toBe('Path `s1` is required.');
            }

            const afterCount = await Alignment.countDocuments();

            expect(afterCount - beforeCount).toBe(0);
        });
    });

    describe('Validates the \'s0edge\' field', () => {
        it('should create an alignment if the `s0edge` is present', async () => {
            await Alignment.create({
                extension,
                s0type,
                s1type,
                s0,
                s1,
                s0edge,
                s1edge 
            });

            const afterCount = await Alignment.countDocuments();

            expect(afterCount - beforeCount).toBe(1);
        });

        it('should not create an alignment if the `s0edge` is not present', async () => {
            try {
                await Alignment.create({
                    extension,
                    s0type,
                    s1type,
                    s0,
                    s1,
                    s1edge
                });
            } catch (err) {
                expect(err.name).toBe('ValidationError');
                expect(err.errors.s0edge.message).toBe('Path `s0edge` is required.');
            }

            const afterCount = await Alignment.countDocuments();

            expect(afterCount - beforeCount).toBe(0);
        });

        it('should not create an alignment if the `s0edge` is not [*|1|2|3|+]', async () => {
            const edges = ['a', '-', '4', '0', '\\'];

            for(let i = 0; i < 5; i++) {
                try {
                    await Alignment.create({
                        extension,
                        s0type,
                        s1type,
                        s0,
                        s1,
                        s0edge: edges[i],
                        s1edge
                    });
                } catch (err) {
                    expect(err.name).toBe('ValidationError');
                    expect(err.errors.s0edge.message).toBe('Alignment edge must be one of: *, 1, 2, 3 or +.');
                }
            }

            const afterCount = await Alignment.countDocuments();

            expect(afterCount - beforeCount).toBe(0);
        });
    });

    describe('Validates the \'s1edge\' field', () => {
        it('should create an alignment if the `s1edge` is present', async () => {
            await Alignment.create({
                extension,
                s0type,
                s1type,
                s0,
                s1,
                s0edge,
                s1edge 
            });

            const afterCount = await Alignment.countDocuments();

            expect(afterCount - beforeCount).toBe(1);
        });

        it('should not create an alignment if the `s1edge` is not present', async () => {
            try {
                await Alignment.create({
                    extension,
                    s0type,
                    s1type,
                    s0,
                    s1,
                    s0edge
                });
            } catch (err) {
                expect(err.name).toBe('ValidationError');
                expect(err.errors.s1edge.message).toBe('Path `s1edge` is required.');
            }

            const afterCount = await Alignment.countDocuments();

            expect(afterCount - beforeCount).toBe(0);
        });

        it('should not create an alignment if the `s1edge` is not [*|1|2|3|+]', async () => {
            const edges = ['a', '-', '4', '0', '\\'];

            for(let i = 0; i < 5; i++) {
                try {
                    await Alignment.create({
                        extension,
                        s0type,
                        s1type,
                        s0,
                        s1,
                        s0edge,
                        s1edge: edges[i]
                    });
                } catch (err) {
                    expect(err.name).toBe('ValidationError');
                    expect(err.errors.s1edge.message).toBe('Alignment edge must be one of: *, 1, 2, 3 or +.');
                }
            }

            const afterCount = await Alignment.countDocuments();

            expect(afterCount - beforeCount).toBe(0);
        }); 
    });
});