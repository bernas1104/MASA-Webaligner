const path = require('path');
const fsmz = require('mz/fs');
const fs = require('fs');

const deleteUploadedFile = require('./../../src/helpers/deleteUploadedFile');
const { saveInputToFile, selectMASAExtension } = require('./../../src/helpers/prepareFilesForAlignment');
const getBestInformation = require('./../../src/helpers/getBestInformation');

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
        const id = Math.floor(Math.random()) + 1;
        const sText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';

        const response = saveInputToFile(id, sText);
        const filePath = path.resolve(__dirname, '..', '..', 'uploads', response);

        expect(await fsmz.exists(filePath)).toBe(true);
        expect(path.extname(filePath)).toBe('.fasta');

        deleteUploadedFile(filePath);
    });
});

describe('Selects the MASA Core extension (CUDAlign or OpenMP) to perform the alignment', () => {
    let filesPath;
    let s0big, s1big;
    let s0small, s1small;
    let filePairs;

    beforeAll(() => {
        filesPath = path.resolve(__dirname, '..', 'utils');

        s0big = 'AE002160.2.fasta';
        s1big = 'CP000051.1.fasta';

        s0small = 'AF133821.1.fasta';
        s1small = 'AY352275.1.fasta';

        filePairs = [[s0small, s1small], [s0big, s1big]];
    });

    it('should select the CUDAlign extension, if \'extension\' equals \'1\'', () => {
        const extension = 1;

        filePairs.forEach(filePair => {
            let masa = selectMASAExtension(extension, filesPath, filePair[0], filePair[1]);
            expect(masa).toBe('cudalign');
        });
    });

    it('should select the OpenMP extension, if \'extension\' equals \'2\'', () => {
        const extension = 2;

        filePairs.forEach(filePair => {
            let masa = selectMASAExtension(extension, filesPath, filePair[0], filePair[1]);
            expect(masa).toBe('masa-openmp');
        });
    });

    it('should select either CUDAlign (files bigger than 1MB) or OpenMP (files smaller than 1MB) based on the file size, if \'extension\' equals \'3\'', () => {
        let counter = 0;
        const extension = 3;

        filePairs.forEach(filePair => {
            let masa = selectMASAExtension(extension, filesPath, filePair[0], filePair[1]);

            if(counter === 0)
                expect(masa).toBe('masa-openmp');
            else
                expect(masa).toBe('cudalign');

            counter++;
        });
    });
});

describe('Gets the Best Score and Best Position information', () => {
    it('should retrieve the Best Score of an alignment', () => {
        const filePath = path.resolve(__dirname, '..', 'utils', 'statistics_01.00');
        const fileData = fs.readFileSync(filePath, 'utf-8').split('\n');

        const bestInformation = getBestInformation(fileData);

        expect.objectContaining({
            bestScore: expect.any(Number),
            bestPosition: expect.any(Array)
        });

        expect(typeof(bestInformation.bestPosition[0])).toBe('number');
        expect(typeof(bestInformation.bestPosition[1])).toBe('number');
    });
});