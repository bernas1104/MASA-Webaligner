const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const sequelize = require('../../../src/database/connection');
const { uuid } = require('uuidv4');

const Alignment = require('../../../src/models/Alignment');
const Sequence = require('../../../src/models/Sequence');

const FetchBinaryResultsService = require(
    '../../../src/services/FetchBinaryResultsService'
);

const SaveInputToFileService = require(
    '../../../src/services/SaveInputToFileService'
);

describe('Service responsible for retrieving the .bin files from the server', () => {
    const fetchBinaryResultsService = new FetchBinaryResultsService();
    const saveInputToFileService = new SaveInputToFileService();

    const filesPath = path.resolve(__dirname, '..', '..', 'uploads');
    const resultPath = path.resolve(__dirname, '..', '..', 'results');

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

        const s0 = await saveInputToFileService.execute({ text: s0text });
        const s1 = await saveInputToFileService.execute({ text: s1text });

        const s0file = await Sequence.create({
            file: s0,
            origin: 3,
            size: fs.statSync(path.join(filesPath, s0)).size,
            edge: '+',
            alignmentId: id,
        });

        const s1file = await Sequence.create({
            file: s1,
            origin: 3,
            size: fs.statSync(path.join(filesPath, s1)).size,
            edge: '+',
            alignmentId: id,
        });

        execSync(
            'cudalign --alignment-edges=++ ' +
            path.join(filesPath, s0file.file) + ' ' +
            path.join(filesPath, s1file.file) + ' ' +
            '-d ' + path.join(resultPath, `${path.parse(s0file.file).name}-${path.parse(s1file.file).name}`) +
            ' > /dev/null 2>&1'
        );
    });

    it('should return a .bin file from the server if the alignment exists', async () => {
        const binData = await fetchBinaryResultsService.execute({ id });

        expect(binData instanceof Buffer).toBe(true);
    });

    it('should throw an error if the alignment does not exist', async () => {
        try {
            await fetchBinaryResultsService.execute({ id: uuid() });
        } catch (err) {
            expect(err instanceof Error).toBe(true);
        }
    });

    afterAll(async () => {
        await Alignment.destroy({ truncate: true, cascade: true });
        await sequelize.close();
        // await execSync(`rm -rf ${path.join(resultPath, '*')}`);
        // await execSync(`rm ${path.join(filesPath, '*')}`);
    });
});
