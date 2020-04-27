const path = require('path');
const fs = require('fs');
const mz = require('mz/fs');

const DeleteUploadedFileService = require(
    '../../../src/services/DeleteUploadedFileService'
);

describe('Deletes an uploaded file to the server', () => {
    const deleteUploadedFileService = new DeleteUploadedFileService();

    const filePath = path.resolve(
        __dirname, '..', '..', 'uploads', 'loremIpsum.fasta'
    );

    beforeAll(() => {
        fs.writeFileSync(filePath, 'Lorem Ipsum');
    });

    it('should delete a file from the server', async () => {
        await deleteUploadedFileService.execute({
            fileName: 'loremIpsum.fasta'
        });

        const deleted = await mz.exists(filePath);

        expect(deleted).toBe(false);
    });

    it('should throw an error if the file name is not given', async () => {
        let error;

        try {
            await deleteUploadedFileService.execute({
                fileName: null,
            });
        } catch (err) {
            error = new Error(err.message);
        }

        expect(error).toEqual(
            new Error('The "path" argument must be of type string. Received null'
        ));
    });
});
