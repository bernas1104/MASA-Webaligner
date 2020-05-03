// require('../../../src/server');
const Alignment = require('../../../src/models/Alignment');
const sequelize = require('../../../src/database/connection');
const CreateAlignmenteService = require(
    '../../../src/services/CreateAlignmentService'
);

describe('Service responsible for creating a new alignment', () => {
    const extension = Math.floor(Math.random() * 3) + 1;

    const only1 = Math.floor(Math.random() * 2);
    const clearn = Math.floor(Math.random() * 2);
    const blockPruning = Math.floor(Math.random() * 2);

    const complement = Math.floor(Math.random() * 4);
    const reverse = Math.floor(Math.random() * 4);

    const fullName = 'Bernardo Costa';
    const email = 'bernardoc1104@gmail.com';

    const createAlignmentService = new CreateAlignmenteService();

    beforeAll(async () => {
        await Alignment.destroy({ truncate: true, cascade: true });
    });

    it('should create an alignment to the database', async () => {
        const alignment = await Alignment.create({
            extension,
            only1,
            clearn,
            blockPruning,
            complement,
            reverse,
            fullName,
            email,
        });

        const savedAlignment = await Alignment.findByPk(alignment.id);

        expect(alignment.dataValues).toEqual(savedAlignment.dataValues);
    });

    it('should not create an alignment if \'extension\' is not given', async () => {
        let error;

        try {
            await Alignment.create({
                only1,
                clearn,
                blockPruning,
                complement,
                reverse,
                fullName,
                email
            });
        } catch (err) {
            error = new Error(err.message);
        }

        expect(error).toEqual(
            new Error('notNull Violation: alignments.extension cannot be null')
        );
    });

    afterAll(async () => {
        await Alignment.destroy({ truncate: true, cascade: true });
        await sequelize.close();
    });
});
