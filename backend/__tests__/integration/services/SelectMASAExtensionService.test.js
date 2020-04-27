const path = require('path');
const fs = require('fs');

const SelectMASAExtensionService = require(
    '../../../src/services/SelectMASAExtensionService'
);

describe('', () => {
    let filesPath;

    const selectMASAExtensionService = new SelectMASAExtensionService();

    beforeAll(() => {
        filesPath = path.resolve(__dirname, '..', '..', 'utils');
    });

    it('should return \'cudalign\' if the extension argument is equal to 1', () => {
        const extension = 1;

        const s0 = 'AF133821.1.fasta';
        const s1 = 'AY352275.1.fasta';

        const masa = selectMASAExtensionService.execute({
            extension,
            filesPath,
            s0,
            s1,
        });

        expect(masa).toBe('cudalign');
    });

    it('should return \'masa-openmp\' if the extension argument is equal to 2', () => {
        const extension = 2;

        const s0 = 'AF133821.1.fasta';
        const s1 = 'AY352275.1.fasta';

        const masa = selectMASAExtensionService.execute({
            extension,
            filesPath,
            s0,
            s1,
        });

        expect(masa).toBe('masa-openmp');
    });

    it('should return \'masa-openmp\' if \'extension\' equals 3 and the files are smaller then 1MB', () => {
        const extension = 3;

        const s0 = 'AF133821.1.fasta';
        const s1 = 'AY352275.1.fasta';

        const masa = selectMASAExtensionService.execute({
            extension,
            filesPath,
            s0,
            s1,
        });

        expect(masa).toBe('masa-openmp');
    });

    it('should return \'cudalign\' if \'extension\' equals 3 and the files are bigger then 1MB', () => {
        const extension = 3;

        const s0 = 'AE002160.2.fasta';
        const s1 = 'CP000051.1.fasta';

        const masa = selectMASAExtensionService.execute({
            extension,
            filesPath,
            s0,
            s1,
        });

        expect(masa).toBe('cudalign');
    });

    it('should throw an error if \'extension\' equals 3 and either \'filesPath\', \'s0\' or \'s1\' are not passed', () => {
        const extension = 3;

        const s0 = 'AF133821.1.fasta';
        const s1 = 'AY352275.1.fasta';

        for(let i = 0; i < 3; i++){
            expect(() => {
                selectMASAExtensionService.execute({
                    extension,
                    filesPath: i === 0 ? null : filesPath,
                    s0: i === 1 ? null : s0,
                    s1: i === 2 ? null : s1,
                });
            }).toThrow();
        }
    });
});
