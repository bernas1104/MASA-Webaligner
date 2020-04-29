const path = require('path');
const fs = require('fs');

const CheckFastaFormatService = require(
    '../../../src/services/CheckFastaFormatService'
);

describe('Checks if the sequence conforms to the FASTA format', () => {
    const filesPath = path.resolve(__dirname, '..', '..', 'utils');

    const checkFastaFormatService = new CheckFastaFormatService();

    const validSequences = [
        'AE002160.2.fasta', 'AF133821.1.fasta', 'AY352275.1.fasta',
        'bernas3.fasta', 'CP000051.1.fasta', 'ZZ999998.1.fasta',
        'ZZ999999.1.fasta',
    ];

    const invalidSequence = ['bernas1.fasta', 'bernas2.fasta'];

    it('should return TRUE if the sequence conforms to the FASTA format', () => {
        for(let i = 0; i < validSequences.length; i++){
            const sequence = fs.readFileSync(
                path.join(filesPath, validSequences[i]), 'utf-8'
            );

            const check = checkFastaFormatService.execute({ sequence });

            expect(check).toBe(true);
        }
    });

    it('should return FALSE if the sequence does not conform to the FASTA format', () => {
        for(let i = 0; i < invalidSequence.length; i++){
            const sequence = fs.readFileSync(
                path.join(filesPath, invalidSequence[i]), 'utf-8'
            );

            const check = checkFastaFormatService.execute({ sequence });

            expect(check).toBe(false);
        }
    });
});
