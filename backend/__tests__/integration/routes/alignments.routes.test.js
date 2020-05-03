const request = require('supertest');
const fs = require('fs');
const fsmz = require('mz/fs');
const path = require('path');
const { execSync } = require('child_process');
const { uuid } = require('uuidv4');

const Alignment = require('../../../src/models/Alignment');
const Sequence = require('../../../src/models/Sequence');
const sequelize = require('../../../src/database/connection');

const app = require('../../../src/server');
require('../../../src/queue');

const textInputs = require('../../utils/textInputs');

describe('Perform a new Alignment (Happy Path, only required fields)', () => {
    var response;

    beforeEach(async () => {
        await Alignment.destroy({ truncate: true, cascade: true });

        const files = path.resolve(__dirname, '..', '..', 'utils');
        const s0FilePath = `${files}/AF133821.1.fasta`;
        const s1FilePath = `${files}/AY352275.1.fasta`;

        const edges = [1, 2, 3, '*', '+'];
        const edge = Math.floor(Math.random() * 4);

        const extension = Math.floor(Math.random() * 3) + 1;
        const s0origin = Math.floor(Math.random() * 3) + 1;
        const s1origin = Math.floor(Math.random() * 3) + 1;

        if(s0origin !== 2 && s1origin !== 2){
            response = await request(app)
                .post('/alignments')
                .field('extension', extension)
                .field('s0origin', s0origin)
                .field('s1origin', s1origin)
                .field('s0input', s0origin === 1 ? 'AF133821.1' : textInputs.s0input)
                .field('s1input', s1origin === 1 ? 'AY352275.1' : textInputs.s1input)
                .field('s0edge', String(edges[edge]))
                .field('s1edge', String(edges[edge]))
        } else if(s0origin === 2 && s1origin !== 2) {
            response = await request(app)
                .post('/alignments')
                .field('extension', extension)
                .field('s0origin', s0origin)
                .field('s1origin', s1origin)
                .field('s1input', s1origin === 1 ? 'AY352275.1' : textInputs.s1input)
                .field('s0edge', String(edges[edge]))
                .field('s1edge', String(edges[edge]))
                .attach('s0input', s0FilePath)
        } else if(s0origin !== 2 && s1origin === 2) {
            response = await request(app)
                .post('/alignments')
                .field('extension', extension)
                .field('s0origin', s0origin)
                .field('s1origin', s1origin)
                .field('s0input', s0origin === 1 ? 'AF133821.1' : textInputs.s0input)
                .field('s0edge', String(edges[edge]))
                .field('s1edge', String(edges[edge]))
                .attach('s1input', s1FilePath)
        } else {
            response = await request(app)
                .post('/alignments')
                .field('extension', extension)
                .field('s0origin', s0origin)
                .field('s1origin', s1origin)
                .field('s0edge', String(edges[edge]))
                .field('s1edge', String(edges[edge]))
                .attach('s0input', s0FilePath)
                .attach('s1input', s1FilePath)
        }
    })

    it('should create a new alignment and two sequences', async () => {
        const {
            body: { alignment: { id: alignmentId }},
            body: { sequence0: { id: sequence0Id }},
            body: { sequence1: { id: sequence1Id }},
        } = response;

        const alignment = await Alignment.findByPk(alignmentId);
        const s0 = await Sequence.findByPk(sequence0Id);
        const s1 = await Sequence.findByPk(sequence1Id);

        expect(response.status).toBe(200);

        expect(alignment).not.toBeNull();
        expect(alignment).toBeTruthy();

        expect(s0).not.toBeNull();
        expect(s0).toBeTruthy();

        expect(s1).not.toBeNull();
        expect(s1).toBeTruthy();
    });

    it('should create the s0 sequence file on the server', async () => {
        const { sequence0: { file: s0 }} = response.body;

        const s0file = path.resolve(
            __dirname, '..', '..', 'uploads', s0
        );

        const s0exists = await fsmz.exists(s0file);

        expect(s0exists).toBe(true);
    });

    it('should create the s1 sequence file on the server', async () => {
        const { sequence1: { file: s1 }} = response.body

        const s1file = path.resolve(
            __dirname, '..', '..', 'uploads', s1
        );

        const s1exists = await fsmz.exists(s1file);

        expect(s1exists).toBe(true);
    });

    afterAll(async () => {
        const filesPath = path.resolve(__dirname, '..', '..', 'uploads');
        const resultsPath = path.resolve(__dirname, '..', '..', 'results');

        // await execSync(`rm -rf ${resultsPath}`);
        // await execSync(`rm ${path.join(filesPath, '*')}`);
    });
});

describe('Perform a new Alignment (Happy Path, all fields', () => {
    jest.setTimeout(8000);

    var response;

    const files = path.resolve(__dirname, '..', '..', 'utils');
    const s0FilePath = `${files}/AF133821.1.fasta`;
    const s1FilePath = `${files}/AY352275.1.fasta`;

    const extension = Math.floor(Math.random() * 3) + 1;

    const only1 = Math.floor(Math.random() * 2) + 1;

    const clearn = Math.floor(Math.random() * 2) + 1;
    const complement = Math.floor(Math.random() * 4);
    const reverse = Math.floor(Math.random() * 4);
    const blockPruning = Math.floor(Math.random() * 2) + 1;

    const fullName = 'Bernardo Costa Nascimento';
    const email = 'bernardoc1104@gmail.com';

    const s0origin = Math.floor(Math.random() * 3) + 1;
    const s1origin = Math.floor(Math.random() * 3) + 1;

    beforeEach(async () => {
        await Alignment.destroy({ truncate: true, cascade: true });

        if(s0origin !== 2 && s1origin !== 2){
            response = await request(app)
                .post('/alignments')
                .field('extension', extension)
                .field('only1', only1 === 1 ? true : false)
                .field('clearn', clearn === 1 ? true : false)
                .field('complement', complement)
                .field('reverse', reverse)
                .field('blockPruning', blockPruning === 1 ? true : false)
                .field('fullName', fullName)
                .field('email', email)
                .field('s0origin', s0origin)
                .field('s1origin', s1origin)
                .field('s0input', s0origin === 1 ? 'AF133821.1' : textInputs.s0input)
                .field('s1input', s1origin === 1 ? 'AY352275.1' : textInputs.s1input)
                .field('s0edge', '*')
                .field('s1edge', '*')
        } else if(s0origin === 2 && s1origin !== 2) {
            response = await request(app)
                .post('/alignments')
                .field('extension', extension)
                .field('only1', only1 === 1 ? true : false)
                .field('clearn', clearn === 1 ? true : false)
                .field('complement', complement)
                .field('reverse', reverse)
                .field('blockPruning', blockPruning === 1 ? true : false)
                .field('fullName', fullName)
                .field('email', email)
                .field('s0origin', s0origin)
                .field('s1origin', s1origin)
                .field('s1input', s1origin === 1 ? 'AY352275.1' : textInputs.s1input)
                .field('s0edge', '*')
                .field('s1edge', '*')
                .attach('s0input', s0FilePath)
        } else if(s0origin !== 2 && s1origin === 2) {
            response = await request(app)
                .post('/alignments')
                .field('extension', extension)
                .field('only1', only1 === 1 ? true : false)
                .field('clearn', clearn === 1 ? true : false)
                .field('complement', complement)
                .field('reverse', reverse)
                .field('blockPruning', blockPruning === 1 ? true : false)
                .field('fullName', fullName)
                .field('email', email)
                .field('s0origin', s0origin)
                .field('s1origin', s1origin)
                .field('s0input', s0origin === 1 ? 'AF133821.1' : textInputs.s0input)
                .field('s0edge', '*')
                .field('s1edge', '*')
                .attach('s1input', s1FilePath)
        } else {
            response = await request(app)
                .post('/alignments')
                .field('extension', extension)
                .field('only1', only1 === 1 ? true : false)
                .field('clearn', clearn === 1 ? true : false)
                .field('complement', complement)
                .field('reverse', reverse)
                .field('blockPruning', blockPruning === 1 ? true : false)
                .field('fullName', fullName)
                .field('email', email)
                .field('s0origin', s0origin)
                .field('s1origin', s1origin)
                .field('s0edge', '*')
                .field('s1edge', '*')
                .attach('s0input', s0FilePath)
                .attach('s1input', s1FilePath)
        }
    });

    it('should create a new alignment and two sequences', async () => {
        const {
            body: { alignment: { id: alignmentId }},
            body: { sequence0: { id: sequence0Id }},
            body: { sequence1: { id: sequence1Id }},
        } = response;

        const alignment = await Alignment.findByPk(alignmentId);
        const s0 = await Sequence.findByPk(sequence0Id);
        const s1 = await Sequence.findByPk(sequence1Id);

        expect(response.status).toBe(200);

        expect(alignment).not.toBeNull();
        expect(alignment).toBeTruthy();

        expect(s0).not.toBeNull();
        expect(s0).toBeTruthy();

        expect(s1).not.toBeNull();
        expect(s1).toBeTruthy();
    });

    it('should create the s0 sequence file on the server', async () => {
        const { sequence0: { file: s0 }} = response.body;

        const s0file = path.resolve(__dirname, '..', '..', 'uploads', s0);

        const s0exists = await fsmz.exists(s0file);

        expect(s0exists).toBe(true);
    });

    it('should create the s1 sequence file on the server', async () => {
        const { sequence1: { file: s1 }} = response.body

        const s1file = path.resolve(__dirname, '..', '..', 'uploads', s1);

        const s1exists = await fsmz.exists(s1file);

        expect(s1exists).toBe(true);
    });

    afterAll(async () => {
        const filesPath = path.resolve(__dirname, '..', '..', 'uploads');
        const resultsPath = path.resolve(__dirname, '..', '..', 'results');

        // await execSync(`rm -rf ${resultsPath}`);
        // await execSync(`rm ${path.join(filesPath, '*')}`);
    });
});

describe('Perform a new Alignment (Sad Paths)', () => {
    it('should return a 400 status code if the NCBI API is selected, but no ID is passed', async () => {
        const response = await request(app)
            .post('/alignments')
            .send({
                extension: Math.floor(Math.random() * 3) + 1,
                s0origin: '1',
                s1origin: '1',
                s0input: '',
                s1input: '',
                s0edge: '*',
                s1edge: '*'
            });

        const { status, message } = response.body;

        expect(response.status).toBe(400);
        expect(status).toBe('error');
        expect(message).toBe('Invalid NCBI Sequence ID.');
    });

    it('should return a 400 status code if the NCBI API is select, but an invalid ID is passed', async () => {
        const response = await request(app)
            .post('/alignments')
            .send({
                extension: Math.floor(Math.random() * 3) + 1,
                s0origin: '1',
                s1origin: '1',
                s0input: 'loremipsum.1',
                s1input: 'loremipsum.2',
                s0edge: '*',
                s1edge: '*'
            });

        const { status, message } = response.body;

        expect(response.status).toBe(400);
        expect(status).toBe('error');
        expect(message).toBe('Invalid NCBI Sequence ID.');
    });

    it('should return a 400 status code if the Upload File is selected, but no file is uploaded', async() => {
        const response = await request(app)
            .post('/alignments')
            .send({
                extension: Math.floor(Math.random() * 3) + 1,
                s0origin: '2',
                s1origin: '2',
                s0edge: '*',
                s1edge: '*'
            });

        const { status, message } = response.body;

        expect(response.status).toBe(400);
        expect(status).toBe('error');
        expect(message).toBe('FASTA file was not uploaded.');
    });

    it('should return a 400 status code if the Upload File is select, but a non-fasta file is uploaded', async () => {
        const files = path.resolve(__dirname, '..', '..', 'utils');
        const s0FilePath = `${files}/bernas1.fasta`;
        const s1FilePath = `${files}/bernas2.fasta`;

        const response = await request(app)
            .post('/alignments')
            .field('extension', Math.floor(Math.random() * 3) + 1)
            .field('s0origin', '2')
            .field('s1origin', '2')
            .field('s0edge', '*')
            .field('s1edge', '*')
            .attach('s0input', s0FilePath)
            .attach('s1input', s1FilePath);

        const { status, message } = response.body;

        expect(response.status).toBe(400);
        expect(status).toBe('error');
        expect(message).toBe('Sequence is not FASTA type.');
    });

    it('should return a 400 status code if the Text Input is selected, but no input is given', async () => {
        const response = await request(app)
            .post('/alignments')
            .send({
                extension: Math.floor(Math.random() * 3) + 1,
                s0origin: '3',
                s1origin: '3',
                s0edge: '*',
                s1edge: '*',
            });

        const { status, message } = response.body;

        expect(response.status).toBe(400);
        expect(status).toBe('error');
        expect(message).toBe('Sequence is not FASTA type.');
    });

    it('should return a 400 status code if the Text Input is selected, but a non-fasta input is given', async () => {
        const response = await request(app)
            .post('/alignments')
            .send({
                extension: Math.floor(Math.random() * 3) + 1,
                s0origin: '3',
                s1origin: '3',
                s0input: fs.readFileSync(
                    path.resolve(__dirname, '..', '..', 'utils', 'bernas1.fasta'), 'utf-8'
                ),
                s1input: fs.readFileSync(
                    path.resolve(__dirname, '..', '..', 'utils', 'bernas2.fasta'), 'utf-8'
                ),
                s0edge: '*',
                s1edge: '*',
            });

        const { status, message } = response.body;

        expect(response.status).toBe(400);
        expect(status).toBe('error');
        expect(message).toBe('Sequence is not FASTA type.');
    });

    it('should return a 400 status code if the \'extension\' is null', async () => {
        const response = await request(app)
            .post('/alignments')
            .send({
                extension: null,
                s0origin: '1',
                s1origin: '1',
                s0input: 'AF133821.1',
                s1input: 'AY352275.1',
                s0edge: '*',
                s1edge: '*',
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('"extension" must be a number');
    });

    it('should return a 400 status code if the \'extension\' is less than zero or bigger than three', async () => {
        const extensions = [0, 4, 1.1, 0.2, 'a', [], {}];

        extensions.forEach(async extension => {
            const response = await request(app)
                .post('/alignments')
                .send({
                    extension,
                    s0origin: '1',
                    s1origin: '1',
                    s0input: 'AF133821.1',
                    s1input: 'AY352275.1',
                    s0edge: '*',
                    s1edge: '*',
                });

            expect(response.status).toBe(400);

            if(extension === 0)
                expect(response.body.message).toBe('"extension" must be larger than or equal to 1');
            else if(extension === 4)
                expect(response.body.message).toBe('"extension" must be less than or equal to 3');
            else if(extension === 1.1 || extension === 0.2)
                expect(response.body.message).toBe('"extension" must be an integer');
            else
                expect(response.body.message).toBe('"extension" must be a number');
        });
    });

    it('should return a 400 status code if \'only1\' is not a boolean value', async () => {
        const only1s = [3, -1.2, 'a', [], {}];

        only1s.forEach(async only1 => {
            const response = await request(app)
                .post('/alignments')
                .send({
                    extension: Math.floor(Math.random() * 3) + 1,
                    only1,
                    s0origin: '1',
                    s1origin: '1',
                    s0input: 'AF133821.1',
                    s1input: 'AY352275.1',
                    s0edge: '+',
                    s1edge: '+',
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('"only1" must be a boolean');
        });
    });

    it('should return a 400 status code if the \'clearn\' is not a boolean value', async () => {
        const clearns = [3, -1.2, 'a', [], {}];

        clearns.forEach(async clearn => {
            const response = await request(app)
                .post('/alignments')
                .send({
                    extension: Math.floor(Math.random() * 3) + 1,
                    clearn,
                    s0origin: '1',
                    s1origin: '1',
                    s0input: 'AF133821.1',
                    s1input: 'AY352275.1',
                    s0edge: '+',
                    s1edge: '+',
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('"clearn" must be a boolean');
        });
    });

    it('should return a 400 status code if the \'complement\' is not an integer between 0 and 3', async () => {
        const complements = [-1, 4, 1.1, 0.2, 'a', [], {}];

        complements.forEach(async complement => {
            const response = await request(app)
                .post('/alignments')
                .send({
                    extension: Math.floor(Math.random() * 3) + 1,
                    complement,
                    s0origin: '1',
                    s1origin: '1',
                    s0input: 'AF133821.1',
                    s1input: 'AY352275.1',
                    s0edge: '+',
                    s1edge: '+',
                });

            expect(response.status).toBe(400);

            if(complement === -1)
                expect(response.body.message).toBe('"complement" must be larger than or equal to 0');
            else if(complement === 4)
                expect(response.body.message).toBe('"complement" must be less than or equal to 3');
            else if(complement === 1.1 || complement === 0.2)
                expect(response.body.message).toBe('"complement" must be an integer');
            else
                expect(response.body.message).toBe('"complement" must be a number');
        });
    });

    it('should return a 400 status code if the \'reverse\' is not an integer between 0 and 3', async () => {
        const reverses = [-1, 4, 1.1, 0.2, 'a', [], {}];

        reverses.forEach(async reverse => {
            const response = await request(app)
                .post('/alignments')
                .send({
                    extension: Math.floor(Math.random() * 3) + 1,
                    reverse,
                    s0origin: '1',
                    s1origin: '1',
                    s0input: 'AF133821.1',
                    s1input: 'AY352275.1',
                    s0edge: '+',
                    s1edge: '+',
                });

            expect(response.status).toBe(400);

            if(reverse === -1)
                expect(response.body.message).toBe('"reverse" must be larger than or equal to 0');
            else if(reverse === 4)
                expect(response.body.message).toBe('"reverse" must be less than or equal to 3');
            else if(reverse === 1.1 || reverse === 0.2)
                expect(response.body.message).toBe('"reverse" must be an integer');
            else
                expect(response.body.message).toBe('"reverse" must be a number');
        });
    });

    it('should return a 400 status code if the \'blockPruning\' is not a boolean value', async () => {
        const blockPrunings = [3, -1.2, 'a', [], {}];

        blockPrunings.forEach(async blockPruning => {
            const response = await request(app)
                .post('/alignments')
                .send({
                    extension: Math.floor(Math.random() * 3) + 1,
                    blockPruning,
                    s0origin: '1',
                    s1origin: '1',
                    s0input: 'AF133821.1',
                    s1input: 'AY352275.1',
                    s0edge: '+',
                    s1edge: '+',
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('"blockPruning" must be a boolean');
        });
    });

    it('should return a 400 status code if the \'s_edge\' is null', async () => {
        for(let i = 0; i < 2; i++){
            const response = await request(app)
                .post('/alignments')
                .send({
                    extension: Math.floor(Math.random() * 3) + 1,
                    s0origin: '1',
                    s1origin: '1',
                    s0input: 'AF133821.1',
                    s1input: 'AY352275.1',
                    s0edge: i === 0 ? null : '+',
                    s1edge: i === 1 ? null : '+',
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe(`"s${String(i)}edge" must be a string`);
        }
    });

    it('should return a 400 status code if the \'s_edge\' is different than 1, 2, 3, + or *', async () => {
        const values = ['', 'b', '/', '-', ' '];

        for(let i = 0; i < 2; i++){
            values.forEach(async value => {
                const response = await request(app)
                    .post('/alignments')
                    .send({
                        extension: Math.floor(Math.random() * 3) + 1,
                        s0origin: '1',
                        s1origin: '1',
                        s0input: 'AF133821.1',
                        s1input: 'AY352275.1',
                        s0edge: i === 0 ? value : '+',
                        s1edge: i === 1 ? value : '+'
                    });

                expect(response.status).toBe(400);

                if(value === '')
                    expect(response.body.message).toBe(`"s${String(i)}edge" is not allowed to be empty`);
                else
                    expect(response.body.message).toBe(`"s${String(i)}edge" with value "${String(value)}" fails to match the required pattern: /^[1-3|+|*]{1}$/`);
            });
        }
    });

    it('should return a 400 status code if the \'s_origin\' is null', async () => {
        for(let i = 0; i < 2; i++){
            const response = await request(app)
                .post('/alignments')
                .send({
                    extension: Math.floor(Math.random() * 3) + 1,
                    s0origin: i === 0 ? null : Math.floor(Math.random() * 3) + 1,
                    s1origin: i === 1 ? null : Math.floor(Math.random() * 3) + 1,
                    s0input: 'AF133821.1',
                    s1input: 'AY352275.1',
                    s0edge: '+',
                    s1edge: '+',
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe(`"s${String(i)}origin" must be a number`);
        }
    });

    it('should return a 400 status code if the \'s_origin\' is less than zero or bigger than three', async () => {
        const values = [0, 4, 2.5, '', [], {}];

        for(let i = 0; i < 2; i++){
            values.forEach(async value => {
                const response = await request(app)
                    .post('/alignments')
                    .send({
                        extension: Math.floor(Math.random() * 3) + 1,
                        s0origin: i === 0 ? value : Math.floor(Math.random() * 3) + 1,
                        s1origin: i === 1 ? value : Math.floor(Math.random() * 3) + 1,
                        s0input: 'AF133821.1',
                        s1input: 'AY352275.1',
                        s0edge: '+',
                        s1edge: '+'
                    });

                expect(response.status).toBe(400);

                if(value === 0)
                    expect(response.body.message).toBe(`"s${i}origin" must be larger than or equal to 1`);
                else if(value === 4)
                    expect(response.body.message).toBe(`"s${i}origin" must be less than or equal to 3`);
                else if(value === 2.5)
                    expect(response.body.message).toBe(`"s${i}origin" must be an integer`);
                else
                    expect(response.body.message).toBe(`"s${i}origin" must be a number`);
            });
        }
    });

    afterAll(async () => {
        await Alignment.deleteMany({});

        const uploads = path.resolve(__dirname, '..', '..', 'uploads');
        const results = path.resolve(__dirname, '..', '..', 'results');

        // await execSync(`rm -rf ${path.join(uploads, '*')}`);
        // await execSync(`rm -rf ${path.join(results, '*')}`);
    })
});

describe('Show data of an Alignment', () => {
    const files = path.resolve(__dirname, '..', '..', 'utils');
    const s0FilePath = `${files}/AF133821.1.fasta`;
    const s1FilePath = `${files}/AY352275.1.fasta`;

    const aExtension = Math.floor(Math.random() * 3) + 1;
    const aS0origin = Math.floor(Math.random() * 3) + 1;
    const aS1origin = Math.floor(Math.random() * 3) + 1;

    let aResponse;

    beforeAll(async () => {
        await Alignment.destroy({ truncate: true, cascade: true });

        if(aS0origin !== 2 && aS1origin !== 2){
            aResponse = await request(app)
                .post('/alignments')
                .field('extension', aExtension)
                .field('s0origin', aS0origin)
                .field('s1origin', aS1origin)
                .field('s0input', aS0origin === 1 ? 'AF133821.1' : textInputs.s0input)
                .field('s1input', aS1origin === 1 ? 'AY352275.1' : textInputs.s1input)
                .field('s0edge', '*')
                .field('s1edge', '*')
        } else if(aS0origin === 2 && aS1origin !== 2) {
            aResponse = await request(app)
                .post('/alignments')
                .field('extension', aExtension)
                .field('s0origin', aS0origin)
                .field('s1origin', aS1origin)
                .field('s1input', aS1origin === 1 ? 'AY352275.1' : textInputs.s1input)
                .field('s0edge', '*')
                .field('s1edge', '*')
                .attach('s0input', s0FilePath)
        } else if(aS0origin !== 2 && aS1origin === 2) {
            aResponse = await request(app)
                .post('/alignments')
                .field('extension', aExtension)
                .field('s0origin', aS0origin)
                .field('s1origin', aS1origin)
                .field('s0input', aS0origin === 1 ? 'AF133821.1' : textInputs.s0input)
                .field('s0edge', '*')
                .field('s1edge', '*')
                .attach('s1input', s1FilePath)
        } else {
            aResponse = await request(app)
                .post('/alignments')
                .field('extension', aExtension)
                .field('s0origin', aS0origin)
                .field('s1origin', aS1origin)
                .field('s0edge', '*')
                .field('s1edge', '*')
                .attach('s0input', s0FilePath)
                .attach('s1input', s1FilePath)
        }
    });

    it('should return the data (extension, types, edges and sequence filenames) of an Alignment', async () => {
        const response = await request(app)
            .get(`/alignments/${aResponse.body.alignment.id}`);

        const {
            alignment: { extension },
            sequences,
        } = response.body;

        const { origin: s0origin, edge: s0edge } = sequences[0];
        const { origin: s1origin, edge: s1edge } = sequences[1];

        expect(response.status).toBe(200);
        expect(extension).toBe(aExtension);
        expect(s0origin).toBe(aS0origin);
        expect(s1origin).toBe(aS1origin);
        expect(s0edge).toBe('*');
        expect(s1edge).toBe('*');
    });

    it('should return a 400 status code, if the requested Alignment does not exist', async () => {
        const values = [uuid(), uuid()];

        for(let i = 0; i < values.length; i++) {
            const response = await request(app).get(`/alignments/${values[i]}`);

            expect(response.status).toBe(400);
            expect(response.body.status).toBe('error');
            expect(response.body.message).toBe('Alignment not found');
        };
    });

    it('should return a 400 status code, if the Sequences for the Alignment are not found', async () => {
        await Sequence.destroy({ where:
            { alignmentId: aResponse.body.alignment.id }
        });

        const response = await request(app).get(`/alignments/${aResponse.body.alignment.id}`);

        expect(response.status).toBe(400);
        expect(response.body.status).toBe('error');
        expect(response.body.message).toBe('Sequences not found');
    });

    afterAll(async () => {
        await Alignment.destroy({ truncate: true, cascade: true });

        const uploads = path.resolve(__dirname, '..', '..', 'uploads');
        const results = path.resolve(__dirname, '..', '..', 'results');

        await execSync(`rm -rf ${path.join(uploads, '*')}`);
        await execSync(`rm -rf ${path.join(results, '*')}`);

        await sequelize.close();
    });
});
