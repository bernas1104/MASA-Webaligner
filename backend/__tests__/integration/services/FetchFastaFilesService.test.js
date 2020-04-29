const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const sequelize = require('../../../src/database/connection');
const { uuid } = require('uuidv4');

const Alignment = require('../../../src/models/Alignment');
const Sequence = require('../../../src/models/Sequence');

const FetchFastaFilesService = require(
    '../../../src/services/FetchFastaFilesService'
);

const SaveInputToFileService = require(
    '../../../src/services/SaveInputToFileService'
);

describe('Service responsible for retrieving the .bin files from the server', () => {
    const fetchFastaFilesService = new FetchFastaFilesService();
    const saveInputToFileService = new SaveInputToFileService();

    const filesPath = path.resolve(__dirname, '..', '..', 'uploads');

    let id;

    beforeAll(async () => {
        await Alignment.destroy({ truncate: true, cascade: true });

        const alignment = await Alignment.create({
            extension: Math.floor(Math.random() * 3) + 1,
            only1: false,
            clearn: Math.floor(Math.random() * 2),
            blockPruning: Math.floor(Math.random() * 2),
            complement: Math.floor(Math.random() * 4),
            reverse: Math.floor(Math.random() * 4),
        });

        id = alignment.id;

        const s0text = fs.readFileSync(
            path.resolve(__dirname, '..', '..', 'utils', 'AF133821.1.fasta'),
            'utf-8'
        );

        const s1text = fs.readFileSync(
            path.resolve(__dirname, '..', '..', 'utils', 'AY352275.1.fasta'),
            'utf-8'
        );

        const s0 = await saveInputToFileService.execute({ id, text: s0text });
        const s1 = await saveInputToFileService.execute({ id, text: s1text });

        await Sequence.create({
            file: s0,
            origin: 3,
            size: fs.statSync(path.join(filesPath, s0)).size,
            edge: '+',
            alignmentId: id,
        });

        await Sequence.create({
            file: s1,
            origin: 3,
            size: fs.statSync(path.join(filesPath, s1)).size,
            edge: '+',
            alignmentId: id,
        });
    });

    it('should fetch exactly 2 fasta files contents', async () => {
        const fastaFiles = await fetchFastaFilesService.execute({ id });

        expect(fastaFiles).toMatchObject({
            s0file: expect.any(String),
            s1file: expect.any(String),
        });
    });

    it('should throw an error if the alignment does not exist', async () => {
        try {
            await fetchFastaFilesService.execute({ id: uuid() });
        } catch (err) {
            expect(err instanceof Error).toBe(true);
        }
    });

    afterAll(async () => {
        await Alignment.destroy({ truncate: true, cascade: true });
        await sequelize.close();
        await execSync(`rm ${path.join(filesPath, '*')}`);
    });
});
