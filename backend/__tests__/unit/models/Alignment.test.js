const Alignment = require('../../../src/models/Alignment');
const app = require('../../../src/controllers/ApplicationController');

describe('Alignment creating validations', () => {
    const edges = ['*', '1', '2', '3', '+'];
    const extension = Math.floor(Math.random() * 3) + 1;
    const s0type = Math.floor(Math.random() * 3) + 1;
    const s1type = Math.floor(Math.random() * 3) + 1;
    const s0edge = edges[Math.floor(Math.random() * 4)];
    const s1edge = edges[Math.floor(Math.random() * 4)];
    const s0 = 'AF133821.1.fasta';
    const s1 = 'AY352275.1.fasta';
    let beforeCount;

    beforeEach(async () => {
        beforeCount = await Alignment.countDocuments();
    });

    afterEach(async () => {
        await Alignment.deleteMany({});
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

            const afterCounter = await Alignment.countDocuments();

            expect(afterCounter - beforeCount).toBe(1);
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

            const afterCounter = await Alignment.countDocuments();

            expect(afterCounter - beforeCount).toBe(0);
        });

        it('should not create an alignment if the \'extension\' is not between 1 and 3', async () => {
            const extensions = [-5, 0, 4, 5, 120];

            extensions.forEach(async extension => {
                try{
                    await Alignment.create({
                        extension,
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
            });

            const afterCounter = await Alignment.countDocuments();

            expect(afterCounter - beforeCount).toBe(0);
        });
    });
});