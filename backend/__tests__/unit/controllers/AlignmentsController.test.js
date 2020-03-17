const request = require('supertest');
const fsmz = require('mz/fs');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const Alignment = require('../../../src/models/Alignment');
const app = require('../../../src/controllers/ApplicationController');
const textInputs = require('../../utils/textInputs');

describe('Performe a new Alignment (Happy Path)', () => {
    var response;

    afterAll(async () => {
        await Alignment.deleteMany({});

        const uploads = path.resolve(__dirname, '..', '..', '..', 'uploads');
        const results = path.resolve(__dirname, '..', '..', '..', 'results');
        /*await*/ exec(`rm -rf ${uploads}/*`);
        /*await*/ exec(`rm -rf ${results}/*`);
        
    })

    beforeAll(async () => {
        await Alignment.deleteMany({});

        const files = path.resolve(__dirname, '..', '..', 'utils');
        const s0FilePath = `${files}/AF133821.1.fasta`;
        const s1FilePath = `${files}/AY352275.1.fasta`;
        
        const extension = Math.floor(Math.random() * 3) + 1;
        const s0type = Math.floor(Math.random() * 3) + 1;
        const s1type = Math.floor(Math.random() * 3) + 1;

        // var response;
        if(s0type !== 2 && s1type !== 2){
            response = await request(app)
                .post('/alignments')
                .field('extension', extension)
                .field('s0type', s0type)
                .field('s1type', s1type)
                .field('s0input', s0type === 1 ? 'AF133821.1' : fs.readFileSync(s0FilePath, 'utf-8'))
                .field('s1input', s1type === 1 ? 'AY352275.1' : fs.readFileSync(s1FilePath, 'utf-8'))
                .field('s0edge', '*')
                .field('s1edge', '*')
        } else if(s0type === 2 && s1type !== 2) {
            response = await request(app)
                .post('/alignments')
                .field('extension', extension)
                .field('s0type', s0type)
                .field('s1type', s1type)
                .field('s1input', s1type === 1 ? 'AY352275.1' : fs.readFileSync(s1FilePath, 'utf-8'))
                .field('s0edge', '*')
                .field('s1edge', '*')
                .attach('s0input', s0FilePath)
        } else if(s0type !== 2 && s1type === 2) {
            response = await request(app)
                .post('/alignments')
                .field('extension', extension)
                .field('s0type', s0type)
                .field('s1type', s1type)
                .field('s0input', s0type === 1 ? 'AF133821.1' : fs.readFileSync(s0FilePath, 'utf-8'))
                .field('s0edge', '*')
                .field('s1edge', '*')
                .attach('s1input', s1FilePath)
        } else {
            response = await request(app)
                .post('/alignments')
                .field('extension', extension)
                .field('s0type', s0type)
                .field('s1type', s1type)
                .field('s0edge', '*')
                .field('s1edge', '*')
                .attach('s0input', s0FilePath)
                .attach('s1input', s1FilePath)
        }
    })

    it('should create a new alignment', async () => {
        expect(response.status).toBe(200);
    })

    it('should create the s0 sequence file on the server', async () => {
        const { s0 } = response.body;

        const s0file = path.resolve(__dirname, '..', '..', '..', 'uploads', s0);

        const s0exists = await fsmz.exists(s0file);
        
        expect(s0exists).toBe(true);
    })

    it('should create the s1 sequence file on the server', async () => {
        const { s1 } = response.body

        const s1file = path.resolve(__dirname, '..', '..', '..', 'uploads', s1);

        const s1exists = await fsmz.exists(s1file);

        expect(s1exists).toBe(true);
    })
})

describe('Perfome a new Alignment (Sad Paths)', () => {
    it('should return a 400 status code if the NCBI API is selected, but no ID is passed', async () => {
        const response = await request(app)
            .post('/alignments')
            .send({
                extension: Math.floor(Math.random() * 3) + 1,
                s0type: '1',
                s1type: '1',
                s0input: '',
                s1input: '',
                s0edge: '*',
                s1edge: '*'
            });
        
        const { s0, s1 } = response.body;

        expect(response.status).toBe(400);
        expect(s0.message).toBe('Path `s0` is required.');
        expect(s1.message).toBe('Path `s1` is required.');
    });

    it('should return a 400 status code if the NCBI API is select, but an invalid s0 ID is passed', async () => {
        const response = await request(app)
            .post('/alignments')
            .send({
                extension: Math.floor(Math.random() * 3) + 1,
                s0type: '1',
                s1type: '1',
                s0input: 'loremipsum.1',
                s1input: 'loremipsum.2',
                s0edge: '*',
                s1edge: '*'
            });

        const { s0, s1 } = response.body;

        expect(response.status).toBe(400);
        expect(s0.error).toBe('Invalid NCBI Sequence ID.');
        expect(s1.error).toBe('Invalid NCBI Sequence ID.');
    });

    it('should return a 400 status code if the Upload File is selected, but no file is uploaded', async() => {
        const response = await request(app)
            .post('/alignments')
            .send({
                extension: Math.floor(Math.random() * 3) + 1,
                s0type: '2',
                s1type: '2',
                s0edge: '*',
                s1edge: '*'
            });

        const { s0, s1 } = response.body;

        expect(response.status).toBe(400);
        expect(s0.message).toBe('Path `s0` is required.');
        expect(s1.message).toBe('Path `s1` is required.');
    });

    it('should return a 400 status code if the Upload File is select, but a non-fasta file is uploaded', async () => {
        const files = path.resolve(__dirname, '..', '..', 'utils');
        const s0FilePath = `${files}/bernas1.fasta`;
        const s1FilePath = `${files}/bernas2.fasta`;

        const response = await request(app)
            .post('/alignments')
            .field('extension', Math.floor(Math.random() * 3) + 1)
            .field('s0type', '2')
            .field('s1type', '2')
            .field('s0edge', '*')
            .field('s1edge', '*')
            .attach('s0input', s0FilePath)
            .attach('s1input', s1FilePath);

        const { s0, s1 } = response.body;

        expect(response.status).toBe(400);
        expect(s0.error).toBe('Sequence is not FASTA type.');
        expect(s1.error).toBe('Sequence is not FASTA type.');
    });

    it('should return a 400 status code if the Text Input is selected, but no input is given', async () => {
        const response = await request(app)
            .post('/alignments')
            .send({
                extension: Math.floor(Math.random() * 3) + 1,
                s0type: '3',
                s1type: '3',
                s0edge: '*',
                s1edge: '*',
            });

        const { s0, s1 } = response.body;

        expect(response.status).toBe(400);
        expect(s0.message).toBe('Path `s0` is required.');
        expect(s1.message).toBe('Path `s1` is required.');
    });

    it('should return a 400 status code if the Text Input is selected, but a non-fasta input is given', async () => {
        const response = await request(app)
            .post('/alignments')
            .send({
                extension: Math.floor(Math.random() * 3) + 1,
                s0type: '3',
                s1type: '3',
                s0input: fs.readFileSync(path.resolve(__dirname, '..', '..', 'utils', 'bernas1.fasta'), 'utf-8'),
                s1input: fs.readFileSync(path.resolve(__dirname, '..', '..', 'utils', 'bernas2.fasta'), 'utf-8'),
                s0edge: '*',
                s1edge: '*',
            });

        const { s0, s1 } = response.body;

        expect(response.status).toBe(400);
        expect(s0.error).toBe('Sequence is not FASTA type.');
        expect(s1.error).toBe('Sequence is not FASTA type.');
    });
});