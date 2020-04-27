const path = require('path');
const fs = require('fs');
const mz = require('mz/fs');
const { uuid } = require('uuidv4');
const { execSync } = require('child_process');

const SaveInputToFileService = require(
    '../../../src/services/SaveInputToFileService'
);

describe('Saves an sequence input to a file on the server', () => {
    let id;
    let text;
    let filesPath;

    const saveInputToFileService = new SaveInputToFileService();

    beforeAll(() => {
        id = uuid();

        text = fs.readFileSync(
            path.resolve(__dirname, '..', '..', 'utils', 'AF133821.1.fasta'),
            'utf-8'
        );

        filesPath = path.resolve(__dirname, '..', '..', 'uploads');
    });

    it('should save the sequence input to the server', async () => {
        const filename = saveInputToFileService.execute({ id, text });

        const check = await mz.exists(path.join(filesPath, filename));

        expect(check).toBe(true);
    });

    afterAll(async () => {
        await execSync(`rm -rf ${path.join(filesPath, '*')}`);
    });
});
