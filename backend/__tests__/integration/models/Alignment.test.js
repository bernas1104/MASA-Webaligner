require('../../../src/server');
const Alignment = require('../../../src/models/Alignment');
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
    toBeBoolean(received) {
        if(received === true || received === false){
            return {
                pass: true,
                message: () => `expected ${received} not to be TRUE or FALSE`
            }
        } else {
            return {
                pass: false,
                message: () => `expected ${received} be TRUE or FALSE`
            }
        }
    }
});

describe('Alignment creating validations', () => {
    const extension = Math.floor(Math.random() * 3) + 1;

    const only1 = Math.floor(Math.random() * 2);
    const clearn = Math.floor(Math.random() * 2);
    const blockPruning = Math.floor(Math.random() * 2);

    const complement = Math.floor(Math.random() * 4);
    const reverse = Math.floor(Math.random() * 4);

    const fullName = 'Bernardo Costa';
    const email = 'bernardoc1104@gmail.com';

    let beforeCount;

    beforeAll(async () => {
        await Alignment.destroy({ truncate: true, cascade: true });
    });

    beforeEach(async () => {
        beforeCount = await Alignment.count();
    });

    afterAll(async () => {
        await Alignment.destroy({ truncate: true, cascade: true });
        await sequelize.close();
    });

    describe('Validates the \'extension\' field', () => {
        it('should create an alignment if the \'extension\' field is present AND between 1 and 3', async () => {
            const alignment = await Alignment.create({
                extension,
                only1,
                clearn,
                blockPruning,
                complement,
                reverse,
            });

            const afterCount = await Alignment.count();

            expect(afterCount - beforeCount).toBe(1);

            expect(isUuid(alignment.id)).toBe(true);
            expect(alignment.extension).toBeInRange(0, 3);
            expect(alignment.only1).toBeBoolean();
            expect(alignment.clearn).toBeBoolean();
            expect(alignment.blockPruning).toBeBoolean();
            expect(alignment.complement).toBeInRange(0, 3);
            expect(alignment.reverse).toBeInRange(0, 3);
        });

        it('should not create an alignment if the \'extension\' is not present', async () => {
            try{
                await Alignment.create({
                    only1,
                    clearn,
                    blockPruning,
                    complement,
                    reverse,
                });
            } catch(err) {
                expect(err.name).toBe('SequelizeValidationError');
            }

            const afterCount = await Alignment.count();

            expect(afterCount - beforeCount).toBe(0);
        });

        it('should not create an alignment if the \'extension\' is not between 0 and 3', async () => {
            const extensions = [-5, -1, 4, 5, 120];

            for(let i = 0; i < 5; i++) {
                try{
                    await Alignment.create({
                        extension: extensions[i],
                        only1,
                        clearn,
                        blockPruning,
                        complement,
                        reverse,
                    });
                } catch(err) {
                    expect(err.name).toBe('SequelizeValidationError');
                }
            }

            const afterCount = await Alignment.count();

            expect(afterCount - beforeCount).toBe(0);
        });
    });

    describe('Validates the \'only1\' field', () => {
        it('should create an alignment if the \'only1\' is TRUE or FALSE', async () => {
            const alignment = await Alignment.create({
                extension,
                only1,
                clearn,
                blockPruning,
                complement,
                reverse,
            });

            const afterCounter = await Alignment.count();

            expect(afterCounter - beforeCount).toBe(1);

            expect(isUuid(alignment.id)).toBe(true);
            expect(alignment.extension).toBeInRange(0, 3);
            expect(alignment.only1).toBeBoolean();
            expect(alignment.clearn).toBeBoolean();
            expect(alignment.blockPruning).toBeBoolean();
            expect(alignment.complement).toBeInRange(0, 3);
            expect(alignment.reverse).toBeInRange(0, 3);
        });

        it('should create an alignment if the \'only1\' is not present', async () => {
            const alignment = await Alignment.create({
                extension,
                clearn,
                blockPruning,
                complement,
                reverse,
            });

            const afterCounter = await Alignment.count();

            expect(afterCounter - beforeCount).toBe(1);
            expect(alignment.only1).toBe(false);
        });

        it('should not create an alignment if the \'only1\' is not a boolean value', async () => {
            const only1s = [3, 'a', -21, 'asd'];

            for(let i = 0; i < 4; i++){
                try{
                    await Alignment.create({
                        extension,
                        only1: only1s[i],
                        clearn,
                        blockPruning,
                        complement,
                        reverse,
                    });
                } catch (err) {
                    expect(err.name).toBe('SequelizeValidationError');
                }

                const afterCount = await Alignment.count();

                expect(afterCount - beforeCount).toBe(0);
            }
        });
    });

    describe('Validates the \'clearn\' field', () => {
        it('should create an alignment if the \'clearn\' is TRUE or FALSE', async () => {
            const alignment = await Alignment.create({
                extension,
                only1,
                clearn,
                blockPruning,
                complement,
                reverse,
            });

            const afterCount = await Alignment.count();

            expect(afterCount - beforeCount).toBe(1);

            expect(isUuid(alignment.id)).toBe(true);
            expect(alignment.extension).toBeInRange(0, 3);
            expect(alignment.only1).toBeBoolean();
            expect(alignment.clearn).toBeBoolean();
            expect(alignment.blockPruning).toBeBoolean();
            expect(alignment.complement).toBeInRange(0, 3);
            expect(alignment.reverse).toBeInRange(0, 3);
        });

        it('should create an alignment if the \'clearn\' is not present', async () => {
            await Alignment.create({
                extension,
                only1,
                blockPruning,
                complement,
                reverse,
            });

            const afterCount = await Alignment.count();

            expect(afterCount - beforeCount).toBe(1);
        });

        it('should not create an alignment if the \'clearn\' is not a boolean value', async () => {
            const clearns = [3, 'a', -21, 'asd'];

            for(let i = 0; i < 4; i++){
                try{
                    await Alignment.create({
                        extension,
                        only1,
                        clearn: clearns[i],
                        blockPruning,
                        complement,
                        reverse,
                    });
                } catch (err) {
                    expect(err.name).toBe('SequelizeValidationError');
                }

                const afterCount = await Alignment.count();

                expect(afterCount - beforeCount).toBe(0);
            }
        });
    });

    describe('Validates the \'blockPruning\' field', () => {
        it('should create an alignment if the \'blockPruning\' is present AND is TRUE or FALSE', async() => {
            const alignment = await Alignment.create({
                extension,
                only1,
                clearn,
                blockPruning,
                complement,
                reverse,
            });

            const afterCount = await Alignment.count();

            expect(afterCount - beforeCount).toBe(1);

            expect(isUuid(alignment.id)).toBe(true);
            expect(alignment.extension).toBeInRange(0, 3);
            expect(alignment.only1).toBeBoolean();
            expect(alignment.clearn).toBeBoolean();
            expect(alignment.blockPruning).toBeBoolean();
            expect(alignment.complement).toBeInRange(0, 3);
            expect(alignment.reverse).toBeInRange(0, 3);
        });

        it('should create an alignment if the \'blockPruning\' is not present', async () => {
            const alignment = await Alignment.create({
                extension,
                only1,
                clearn,
                complement,
                reverse
            });

            const afterCount = await Alignment.count();

            expect(afterCount - beforeCount).toBe(1);
            expect(alignment.blockPruning).toBe(true);
        });

        it('should not create an alignment if the \'blockPruning\' is not a boolean value', async () => {
            const blockPrunings = [2, 'a', [], {}];

            for(let i = 0; i < 4; i++){
                try{
                    await Alignment.create({
                        extension,
                        only1,
                        clearn,
                        blockPruning: blockPrunings[i],
                        complement,
                        reverse,
                    });
                } catch (err) {
                    expect(err.name).toBe('SequelizeValidationError');
                }
            }

            const afterCount = await Alignment.count();

            expect(afterCount - beforeCount).toBe(0);
        });
    });

    describe('Validates the \'complement\' field', () => {
        it('should create an alignment if the \'complement\' field is present AND between 0 and 3', async () => {
            const alignment = await Alignment.create({
                extension,
                only1,
                clearn,
                blockPruning,
                complement,
                reverse,
            });

            const afterCount = await Alignment.count();

            expect(afterCount - beforeCount).toBe(1);
            expect(isUuid(alignment.id)).toBe(true);
            expect(alignment.extension).toBeInRange(0, 3);
            expect(alignment.only1).toBeBoolean();
            expect(alignment.clearn).toBeBoolean();
            expect(alignment.blockPruning).toBeBoolean();
            expect(alignment.complement).toBeInRange(0, 3);
            expect(alignment.reverse).toBeInRange(0, 3);
        });

        it('should create an alignment if the \'complement\' is not present', async () => {
            const alignment = await Alignment.create({
                extension,
                only1,
                clearn,
                blockPruning,
                reverse,
            });

            const afterCount = await Alignment.count();

            expect(afterCount - beforeCount).toBe(1);
            expect(alignment.complement).toBe(0);
        });

        it('should not create an alignment if the \'complement\' field is not between 0 and 3', async () => {
            const complements = [5, 'a', -12, 'ajds'];

            for(let i = 0; i < 4; i++){
                try {
                    await Alignment.create({
                        extension,
                        only1,
                        clearn,
                        blockPruning,
                        complement: complements[i],
                        reverse,
                    });
                } catch (err) {
                    expect(err.name).toBe('SequelizeValidationError');
                }
            }

            const afterCount = await Alignment.count();

            expect(afterCount - beforeCount).toBe(0);
        });
    });

    describe('Validates the \'reverse\' field', () => {
        it('should create an alignment if the \'reverse\' field is present AND between 0 and 3', async () => {
            const alignment = await Alignment.create({
                extension,
                only1,
                clearn,
                blockPruning,
                complement,
                reverse,
            });

            const afterCount = await Alignment.count();

            expect(afterCount - beforeCount).toBe(1);
            expect(isUuid(alignment.id)).toBe(true);
            expect(alignment.extension).toBeInRange(0, 3);
            expect(alignment.only1).toBeBoolean();
            expect(alignment.clearn).toBeBoolean();
            expect(alignment.blockPruning).toBeBoolean();
            expect(alignment.complement).toBeInRange(0, 3);
            expect(alignment.reverse).toBeInRange(0, 3);
        });

        it('should create an alignment if the \'reverse\' field is not present', async () => {
            const alignment = await Alignment.create({
                extension,
                only1,
                clearn,
                blockPruning,
                complement,
            });

            const afterCount = await Alignment.count();

            expect(afterCount - beforeCount).toBe(1);
            expect(alignment.reverse).toBe(0);
        });

        it('should not create an alignment if the \'reverse\' field is not between 0 and 3', async () => {
            const reverses = [-1, 4, 'a', 'asd'];

            for(let i = 0; i < 4; i++){
                try {
                    await Alignment.create({
                        extension,
                        only1,
                        clearn,
                        blockPruning,
                        complement,
                        reverse: reverses[i],
                    });
                } catch (err) {
                    expect(err.name).toBe('SequelizeValidationError');
                }
            }

            const afterCount = await Alignment.count();

            expect(afterCount - beforeCount).toBe(0);
        });
    });

    describe('Validates the \'fullName\' field', () => {
        it('should create an alignment with or without the \'fullName\' field, if it is formatted correctly', async () => {
            for(let i = 0; i < 2; i++){
                let alignment
                if(i === 0) {
                    alignment = await Alignment.create({
                        extension,
                        only1,
                        clearn,
                        blockPruning,
                        complement,
                        reverse,
                        fullName,
                        email,
                    });
                } else {
                    alignment = await Alignment.create({
                        extension,
                        only1,
                        clearn,
                        blockPruning,
                        complement,
                        reverse,
                        email,
                    });
                }

                expect(isUuid(alignment.id)).toBe(true);
                expect(alignment.extension).toBeInRange(0, 3);
                expect(alignment.only1).toBeBoolean();
                expect(alignment.clearn).toBeBoolean();
                expect(alignment.blockPruning).toBeBoolean();
                expect(alignment.complement).toBeInRange(0, 3);
                expect(alignment.reverse).toBeInRange(0, 3);
                expect(alignment.fullName).toBe(
                    i === 0 ?
                    fullName :
                    null
                );
                expect(alignment.email).toBe(email);
            }

            const afterCount = await Alignment.count();

            expect(afterCount - beforeCount).toBe(2);
        });

        it('should not create an alignment if \'fullName\' is not formatted correctly', async () => {
            const fullNames = ['asdhj1 daskj', 'dajkla-asjkd', 'adjlk*adjsl dasjdj asjdl', ''];

            for(let i = 0; i < 4; i++){
                try{
                    alignment = await Alignment.create({
                        extension,
                        only1,
                        clearn,
                        blockPruning,
                        complement,
                        reverse,
                        fullName: fullNames[i],
                        email,
                    });
                } catch (err) {
                    expect(err.name).toBe('SequelizeValidationError')
                }
            }

            const afterCount = await Alignment.count();

            expect(afterCount - beforeCount).toBe(0);
        });
    });

    describe('Validates the \'fullName\' field', () => {
        it('should create an alignment with or without \'email\' field and is a valid email', async () => {
            for(let i = 0; i < 2; i++){
                let alignment
                if(i === 0) {
                    alignment = await Alignment.create({
                        extension,
                        only1,
                        clearn,
                        blockPruning,
                        complement,
                        reverse,
                        fullName,
                        email,
                    });
                } else {
                    alignment = await Alignment.create({
                        extension,
                        only1,
                        clearn,
                        blockPruning,
                        complement,
                        reverse,
                        fullName,
                    });
                }

                expect(isUuid(alignment.id)).toBe(true);
                expect(alignment.extension).toBeInRange(0, 3);
                expect(alignment.only1).toBeBoolean();
                expect(alignment.clearn).toBeBoolean();
                expect(alignment.blockPruning).toBeBoolean();
                expect(alignment.complement).toBeInRange(0, 3);
                expect(alignment.reverse).toBeInRange(0, 3);
                expect(alignment.fullName).toBe(fullName);
                expect(alignment.email).toBe(
                    i === 0 ?
                    email :
                    null
                );
            }

            const afterCount = await Alignment.count();

            expect(afterCount - beforeCount).toBe(2);
        });

        it('should not create an alignment if the \'email\' field is not a valid email', async () => {
            const emails = ['', 'sakdjla@asdjacom', 'jdasklgmail.com'];

            for(let i = 0; i < 3; i++){
                try {
                    const alignment = await Alignment.create({
                        extension,
                        only1,
                        clearn,
                        blockPruning,
                        complement,
                        reverse,
                        fullName,
                        email: emails[i],
                    });
                } catch (err) {
                    expect(err.name).toBe('SequelizeValidationError');
                }
            }

            const afterCount = await Alignment.count();

            expect(afterCount - beforeCount).toBe(0);
        });
    });
});
