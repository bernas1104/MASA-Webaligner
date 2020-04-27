const { execSync } = require('child_process');
const path = require('path');

const CheckAlignmentReadyService = require(
    '../../../src/services/CheckAlignmentReadyService'
);

describe('Checks if the requested alignment is ready', () => {
    const filesPath = path.resolve(__dirname, '..', '..', 'utils');
    const resultsPath = path.resolve(__dirname, '..', '..', 'results');

    const checkAlignmentReadyService = new CheckAlignmentReadyService();

    beforeAll(async () => {
        await execSync(
            'cudalign --alignment-edges=++ ' +
            path.join(filesPath, 'AF133821.1.fasta') + ' ' +
            path.join(filesPath, 'AY352275.1.fasta') + ' ' +
            '-d ' + path.join(resultsPath, '1-1') + ' > /dev/null 2>&1'
        );

        await execSync(
            'cudalign --alignment-edges=++ ' +
            path.join(filesPath, 'AF133821.1.fasta') + ' ' +
            path.join(filesPath, 'AY352275.1.fasta') + ' ' +
            '-1 -d ' + path.join(resultsPath, '2-2') + ' > /dev/null 2>&1'
        );

        await new Promise(r => setTimeout(r, 2000));
    });

    it('should return TRUE if the alignment is ready', async () => {
        for(let i = 1; i < 3; i++){
            const isReady = await checkAlignmentReadyService.execute({
                s0: String(i),
                s1: String(i),
                only1: i === 1 ? false : true,
            });

            expect(isReady).toBe(true);
        }
    });

    it('should return FALSE if the alignment is not ready', async () => {
        const isReady = await checkAlignmentReadyService.execute({
            s0: String(3),
            s1: String(3),
            only1: Math.floor(Math.random() * 2) === 0 ? true : false,
        });

        expect(isReady).toBe(false);
    });

    it('should throw an error if one of the parameters is not given', async () => {
        for(let i = 0; i < 2; i++){
            let error;
            try{
                await checkAlignmentReadyService.execute({
                    s0: i === 0 ? null : String(3),
                    s1: i === 1 ? null : String(3),
                    only: false,
                });
            } catch (err) {
                error = new Error(err.message);
            }

            expect(error).toEqual(
                new Error('The "path" argument must be of type string. Received null'
            ));
        }
    });

    afterAll(async () => {
        await execSync(`rm -rf ${resultsPath}/*`);
    });
});
