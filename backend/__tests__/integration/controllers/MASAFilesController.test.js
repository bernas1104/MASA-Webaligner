const request = require('supertest');
const path = require('path');
const exec = require('child_process').execSync;

const app = require('./../../../src/controllers/ApplicationController').express;
require('./../../../src/queue');
const Alignment = require('./../../../src/models/Alignment');

describe('MASA Files Controller', () => {
    const uploads = path.resolve(__dirname, '..', '..', '..', 'uploads');
    const results = path.resolve(__dirname, '..', '..', '..', 'results');

    describe('Is Alignment Ready?', () => {
        var alignment;

        beforeAll(async () => {
            const filesPath = path.resolve(__dirname, '..', '..', 'utils');

            alignment = await request(app)
                .post('/alignments')
                .field('extension', 1)
                .field('s0type', 2)
                .field('s1type', 2)
                .attach('s0input', filesPath + '/AF133821.1.fasta')
                .attach('s1input', filesPath + '/AY352275.1.fasta')
                .field('s0edge', '*')
                .field('s1edge', '*')

            await new Promise(r => setTimeout(r, 2000));
        });
    
        it('should return \'true\' if the alignment results are ready', async () => {
            const { body: { isReady }} = await request(app)
                .get(`/isAlignmentReady?s0=${alignment.body.s0}&s1=${alignment.body.s1}`);
    
            expect(isReady).toBe(true);
        });
    
        it('should return \'false\' if the alignments results are not ready', async () => {
            const { s0, s1 } = alignment.body;
    
            await exec(`rm ${results}/${path.parse(s0).name}-${path.parse(s1).name}/alignment.00.bin`);
    
            const { body: { isReady }} = await request(app)
                .get(`/isAlignmentReady?s0=${alignment.body.s0}&s1=${alignment.body.s1}`);
    
            expect(isReady).toBe(false);
        });
    });

    describe('Fetch Binary Files', () => {
        let alignment;

        beforeAll(async () => {
            alignment = await request(app)
                .post('/alignments')
                .field('extension', 1)
                .field('s0type', 1)
                .field('s1type', 1)
                .field('s0input', 'AF133821.1')
                .field('s1input', 'AY352275.1')
                .field('s0edge', '*')
                .field('s1edge', '*')
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
                .field('extension', 1)
                .field('s0type', 1)
                .field('s1type', 1)
                .field('s0input', 'AF133821.1')
                .field('s1input', 'AY352275.1')
                .field('s0edge', '*')
                .field('s1edge', '*')
        });

        it('should return the contents of the \'.fasta\' files created by the Alignment request (Happy Path)', async () => {
            const response = await request(app).get(`/fasta/${alignment.body._id}`);
                
            const { s0file, s1file } = response.body;
            expect(response.status).toBe(200);
            expect(s0file).not.toBeFalsy();
            expect(s1file).not.toBeFalsy();
        });

        it('should return a 400 status code, if the requested \'.fasta\' files are for an non-existent Alignment', async () => {
            const response = await request(app).get(`/fasta/${1}`);

            expect(response.status).toBe(400);
        });

        it('should return a 500 status code, if the requested \'.fasta\' files cannot be fetched', async () => {
            const { s0, s1 } = alignment.body;

            await exec(`rm ${uploads}/${s0}`);
            await exec(`rm ${uploads}/${s1}`);

            const response = await request(app).get(`/fasta/${alignment.body._id}`);

            expect(response.status).toBe(500);
        });
    });

    afterAll(async () => {
        await Alignment.deleteMany({});

        await exec(`rm -rf ${uploads}/*`);
        await exec(`rm -rf ${results}/*`);
    })
});