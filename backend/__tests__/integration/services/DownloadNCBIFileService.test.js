const path = require('path');
const mz = require('mz/fs');
const { uuid } = require('uuidv4');

const AppError = require('../../../src/errors/AppError');

const DownloadNCBIFileService = require(
    '../../../src/services/DownloadNCBIFileService'
);

describe('Service responsible for accessing the NCBI API and retrieve FASTA files', () => {
    jest.setTimeout(10000);

    const downloadNCBIFileService = new DownloadNCBIFileService();

    const id = uuid();
    const sequence = 'AF133821.1';

    it('should download a fasta sequence file', async () => {
        const filePath = path.resolve(__dirname, '..', '..', 'uploads');

        const name = await downloadNCBIFileService.execute({ id, sequence });

        const check = await mz.exists(path.join(filePath), name);

        expect(check).toBe(true);
    });

    it('should download a file if the \'sequence\' is an empty string', async () => {
        const filePath = path.resolve(__dirname, '..', '..', 'uploads');

        const name = await downloadNCBIFileService.execute({ id, sequence: '' });

        const check = await mz.exists(path.join(filePath), name);

        expect(check).toBe(true);
    });

    it('should throw an error if the sequence name does not exist', async () => {
        const filePath = path.resolve(__dirname, '..', '..', 'uploads');

        try {
            await downloadNCBIFileService.execute({
                id,
                sequence: 'af1338211.5'
            });
        } catch (err) {
            expect(err instanceof AppError).toBe(true);
        }
    });
});
