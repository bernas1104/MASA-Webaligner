const path = require('path');
const fs = require('fs');

const checkFastaFormat = require('./../../src/validations/checkFastaFormat');

describe('Checks if a given file is in FASTA format', () => {
    var filesPath;

    var trueFiles = [
        'AF133821.1.fasta',
        'AY352275.1.fasta',
        'ZZ999998.1.fasta',
        'ZZ999999.1.fasta',
        'bernas3.fasta'
    ];

    var falseFiles = [
        'bernas1.fasta',
        'bernas2.fasta'
    ];

    beforeAll(() => {
        filesPath = path.resolve(__dirname, '..', 'utils');
    });

    it('should return true if a file is in FASTA format', () => {
        trueFiles.forEach(file => {
            const data = fs.readFileSync(path.resolve(filesPath, file), 'utf-8');
            const check = checkFastaFormat(data);
            expect(check).toBe(true);
        });
    });

    it('should return false if a file is not in FASTA format', () => {
        falseFiles.forEach(file => {
            const data = fs.readFileSync(path.resolve(filesPath, file), 'utf-8');
            const check = checkFastaFormat(data);
            expect(check).toBe(false);
        });
    });
});