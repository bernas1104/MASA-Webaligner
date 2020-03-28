const path = require('path');
const fsmz = require('mz/fs');
const fs = require('fs');

const deleteUploadedFile = require('./../../src/helpers/deleteUploadedFile');
const { saveInputToFile } = require('./../../src/helpers/prepareFilesForAlignment');

describe('Delete Uploaded File', () => {
    const newFilePath = path.resolve(__dirname, '..', '..', 'uploads', 'testFile.fasta');

    beforeAll(() => {
        fs.writeFileSync(newFilePath, 'Wrinting a file');
    });

    it('should delete an uploaded file from the \'uploads\' folder', async () => {
        deleteUploadedFile(newFilePath);

        const fileDeleted = await fsmz.exists(newFilePath);

        expect(fileDeleted).toBe(false);
    });
});

describe('Saves an user sequence input to file on the \'uploads\' folder', () => {
    it('should save the user input to a .fasta file', async () => {
        const id = Math.random();
        const sText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';

        const response = saveInputToFile(id, sText);
        const filePath = path.resolve(__dirname, '..', '..', 'uploads', response);

        expect(await fsmz.exists(filePath)).toBe(true);
        expect(path.extname(filePath)).toBe('.fasta');
    });
});