const request = require('supertest');
const path = require('path');
const exec = require('child_process').execSync;

const app = require('./../../../src/controllers/ApplicationController').express;
require('./../../../src/queue');
const Alignment = require('./../../../src/models/Alignment');

async function sleep(){
    return await new Promise(r => setTimeout(r, 2000));
}

describe('MASA Files Controller', () => {
    const uploads = path.resolve(__dirname, '..', '..', '..', 'uploads');
    const results = path.resolve(__dirname, '..', '..', '..', 'results');

    describe('Is Alignment Ready?', () => {
        var alignment1, alignment2;

        beforeAll(async () => {
            const filesPath = path.resolve(__dirname, '..', '..', 'utils');

            alignment1 = await request(app)
                .post('/alignments')
                .field('extension', 2)
                .field('only1', false)
                .field('s0type', 2)
                .field('s1type', 2)
                .attach('s0input', filesPath + '/AF133821.1.fasta')
                .attach('s1input', filesPath + '/AY352275.1.fasta')
                .field('s0edge', '*')
                .field('s1edge', '*')

            alignment2 = await request(app)
                .post('/alignments')
                .field('extension', 2)
                .field('only1', true)
                .field('s0type', 2)
                .field('s1type', 2)
                .attach('s0input', filesPath + '/AF133821.1.fasta')
                .attach('s1input', filesPath + '/AY352275.1.fasta')
                .field('s0edge', '*')
                .field('s1edge', '*')

            await sleep();
        });
    
        it('should return \'true\' if the alignment\'s results are ready (all stages)', async () => {
            const { body: { isReady }} = await request(app)
                .get(`/isAlignmentReady?s0=${alignment1.body.s0}&s1=${alignment1.body.s1}&only1=${false}`);

            expect(isReady).toBe(true);
        });

        it('should return \'true\' if the alignment\'s results are ready (only stage I', async () => {
            const { body: { isReady }} = await request(app)
                .get(`/isAlignmentReady?s0=${alignment2.body.s0}&s1=${alignment2.body.s1}&only1=${true}`);

            expect(isReady).toBe(true);
        });
    
        it('should return \'false\' if the alignment\'s results are not ready', async () => {
            const { s0, s1 } = alignment1.body;
    
            await exec(`rm ${results}/${path.parse(s0).name}-${path.parse(s1).name}/alignment.00.bin`);
            
            const { body: { isReady }} = await request(app)
                .get(`/isAlignmentReady?s0=${alignment1.body.s0}&s1=${alignment1.body.s1}&only=${false}`);            
    
            expect(isReady).toBe(false);
        });

        it('should return \'false\' if the alignment\'s results are not ready', async () => {
            const { s0, s1 } = alignment2.body;

            await exec(`rm ${results}/${path.parse(s0).name}-${path.parse(s1).name}/statistics_01.00`);

            const { body: { isReady }} = await request(app)
                .get(`/isAlignmentReady?s0=${alignment2.body.s0}&s1=${alignment2.body.s1}&only=${false}`);

            expect(isReady).toBe(false);
        });
    });

    describe('Fetch Binary Files', () => {
        let alignment;

        beforeAll(async () => {
            alignment = await request(app)
                .post('/alignments')
                .field('extension', 2)
                .field('s0type', 1)
                .field('s1type', 1)
                .field('s0input', 'AF133821.1')
                .field('s1input', 'AY352275.1')
                .field('s0edge', '*')
                .field('s1edge', '*');
        });

        it('should return the contents of the \'.bin\' file created by the MASA Alignment Tool (Happy Path)', async () => {
            const response = await request(app).get(`/bin/${alignment.body._id}`);
            
            expect(response.status).toBe(200);
            expect(response.body).not.toBeFalsy();
        });

        it('should return a status code 400, if the requested \'.bin\' is for an non-existent Alignment', async () => {
            const response = await request(app).get('/bin/1');
            
            expect(response.status).toBe(400);
        });

        it('should return a status code 500, if the requested \'.bin\' cannot be fetched', async () => {
            const { s0, s1 } = alignment.body;

            await exec(`rm ${results}/${path.parse(s0).name}-${path.parse(s1).name}/alignment.00.bin`);

            const response = await request(app).get(`/bin/${alignment.body._id}`);

            expect(response.status).toBe(500);
        });
    });

    describe('Fetch Fasta Files', () => {
        let alignment;

        beforeAll(async () => {
            alignment = await request(app)
                .post('/alignments')
                .field('extension', 2)
                .field('s0type', 1)
                .field('s1type', 1)
                .field('s0input', 'AF133821.1')
                .field('s1input', 'AY352275.1')
                .field('s0edge', '*')
                .field('s1edge', '*');
        });

        test('should return the contents of the \'.fasta\' files created by the Alignment request (Happy Path)', async () => {
            const response = await request(app).get(`/fasta/${alignment.body._id}`);
                
            const { s0file, s1file } = response.body;
            expect(response.status).toBe(200);
            expect(s0file).not.toBeFalsy();
            expect(s1file).not.toBeFalsy();
        });

        test('should return a 400 status code, if the requested \'.fasta\' files are for an non-existent Alignment', async () => {
            const response = await request(app).get(`/fasta/${1}`);

            expect(response.status).toBe(400);
        });

        test('should return a 500 status code, if the requested \'.fasta\' files cannot be fetched', async () => {
            const { s0, s1 } = alignment.body;

            await exec(`rm ${uploads}/${s0}`);
            await exec(`rm ${uploads}/${s1}`);

            const response = await request(app).get(`/fasta/${alignment.body._id}`);

            expect(response.status).toBe(500);
        });
    });

    describe('Fetch Stage #1 Results', () => {
        let alignment;

        beforeAll(async () => {
            const filesPath = path.resolve(__dirname, '..', '..', 'utils');

            alignment = await request(app)
                .post('/alignments')
                .field('extension', 2)
                .field('only1', true)
                .field('s0type', 2)
                .field('s1type', 2)
                .attach('s0input', path.join(filesPath, 'AF133821.1.fasta'))
                .attach('s1input', path.join(filesPath, 'AY352275.1.fasta'))
                .field('s0edge', '*')
                .field('s1edge', '*');

            // await sleep();
        });

        it('should return the contents of the Stage I Alignment', async () => {
            const response = await request(app).get(`/stage-i-results/${alignment.body._id}`);

            expect(response.status).toBe(200);

            expect.objectContaining({
                bestScore: expect.any(Number),
                bestPosition: expect.any(Array)
            });

            expect(typeof(response.body.bestPosition[0])).toBe('number');
            expect(typeof(response.body.bestPosition[1])).toBe('number');
        });
    });

    afterAll(async () => {
        await Alignment.deleteMany({});

        await exec(`rm -rf ${uploads}/*`);
        await exec(`rm -rf ${results}/*`);
    })
});