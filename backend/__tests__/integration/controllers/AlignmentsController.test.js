const request = require('supertest');
const fsmz = require('mz/fs');
const path = require('path');

const Alignment = require('../../../src/models/Alignment');
const app = require('../../../src/controllers/ApplicationController').express;
require('../../../src/queue');
const textInputs = require('../../utils/textInputs');

describe('Perform a new Alignment (Happy Path, only required fields)', () => {
    var response;

    beforeEach(async () => {
        await Alignment.deleteMany({});

        const files = path.resolve(__dirname, '..', '..', 'utils');
        const s0FilePath = `${files}/AF133821.1.fasta`;
        const s1FilePath = `${files}/AY352275.1.fasta`;

        const edges = [1, 2, 3, '*', '+'];
        const edge = Math.floor(Math.random() * 4);
        
        // const extension = Math.floor(Math.random() * 3) + 1;
        const extension = 2;
        const s0type = Math.floor(Math.random() * 3) + 1;
        const s1type = Math.floor(Math.random() * 3) + 1;

        // var response;
        if(s0type !== 2 && s1type !== 2){
            response = await request(app)
                .post('/alignments')
                .field('extension', extension)
                .field('s0type', s0type)
                .field('s1type', s1type)
                .field('s0input', s0type === 1 ? 'AF133821.1' : textInputs.s0input)
                .field('s1input', s1type === 1 ? 'AY352275.1' : textInputs.s1input)
                .field('s0edge', String(edges[edge]))
                .field('s1edge', String(edges[edge]))
        } else if(s0type === 2 && s1type !== 2) {
            response = await request(app)
                .post('/alignments')
                .field('extension', extension)
                .field('s0type', s0type)
                .field('s1type', s1type)
                .field('s1input', s1type === 1 ? 'AY352275.1' : textInputs.s1input)
                .field('s0edge', String(edges[edge]))
                .field('s1edge', String(edges[edge]))
                .attach('s0input', s0FilePath)
        } else if(s0type !== 2 && s1type === 2) {
            response = await request(app)
                .post('/alignments')
                .field('extension', extension)
                .field('s0type', s0type)
                .field('s1type', s1type)
                .field('s0input', s0type === 1 ? 'AF133821.1' : textInputs.s0input)
                .field('s0edge', String(edges[edge]))
                .field('s1edge', String(edges[edge]))
                .attach('s1input', s1FilePath)
        } else {
            response = await request(app)
                .post('/alignments')
                .field('extension', extension)
                .field('s0type', s0type)
                .field('s1type', s1type)
                .field('s0edge', String(edges[edge]))
                .field('s1edge', String(edges[edge]))
                .attach('s0input', s0FilePath)
                .attach('s1input', s1FilePath)
        }
    })

    it('should create a new alignment', async () => {
        expect(response.status).toBe(200);
    });

    it('should create the s0 sequence file on the server', async () => {
        const { s0 } = response.body;

        const s0file = path.resolve(__dirname, '..', '..', '..', 'uploads', s0);

        const s0exists = await fsmz.exists(s0file);
        
        expect(s0exists).toBe(true);
    });

    it('should create the s1 sequence file on the server', async () => {
        const { s1 } = response.body

        const s1file = path.resolve(__dirname, '..', '..', '..', 'uploads', s1);

        const s1exists = await fsmz.exists(s1file);

        expect(s1exists).toBe(true);
    });
});

describe('Perform a new Alignment (Happy Path, all fields', () => {
    var response;

    beforeEach(async () => {
        await Alignment.deleteMany({});

        const files = path.resolve(__dirname, '..', '..', 'utils');
        const s0FilePath = `${files}/AF133821.1.fasta`;
        const s1FilePath = `${files}/AY352275.1.fasta`;
        
        // const extension = Math.floor(Math.random() * 3) + 1;
        const extension = 2;
        const clearn = Math.floor(Math.random() * 2) + 1;
        const complement = Math.floor(Math.random() * 3) + 1;
        const reverse = Math.floor(Math.random() * 3) + 1;
        const name = 'Bernardo Costa Nascimento';
        const email = 'bernardoc1104@gmail.com';
        const opt = Math.floor(Math.random() * 2) + 1;

        const s0type = Math.floor(Math.random() * 3) + 1;
        const s1type = Math.floor(Math.random() * 3) + 1;

        // var response;
        if(s0type !== 2 && s1type !== 2){
            response = await request(app)
                .post('/alignments')
                .field('extension', extension)
                .field('clearn', opt === 1 ? (clearn === 1 ? true : false) : '')
                .field('complement', opt === 1 ? complement : '')
                .field('reverse', opt === 1 ? reverse : '')
                .field('name', opt === 1 ? name : '')
                .field('email', opt === 1 ? email : '')
                .field('s0type', s0type)
                .field('s1type', s1type)
                .field('s0input', s0type === 1 ? 'AF133821.1' : textInputs.s0input)
                .field('s1input', s1type === 1 ? 'AY352275.1' : textInputs.s1input)
                .field('s0edge', '*')
                .field('s1edge', '*')
        } else if(s0type === 2 && s1type !== 2) {
            response = await request(app)
                .post('/alignments')
                .field('extension', extension)
                .field('clearn', opt === 1 ? (clearn === 1 ? true : false) : '')
                .field('complement', opt === 1 ? complement : '')
                .field('reverse', opt === 1 ? reverse : '')
                .field('name', opt === 1 ? name : '')
                .field('email', opt === 1 ? email : '')
                .field('s0type', s0type)
                .field('s1type', s1type)
                .field('s1input', s1type === 1 ? 'AY352275.1' : textInputs.s1input)
                .field('s0edge', '*')
                .field('s1edge', '*')
                .attach('s0input', s0FilePath)
        } else if(s0type !== 2 && s1type === 2) {
            response = await request(app)
                .post('/alignments')
                .field('extension', extension)
                .field('clearn', opt === 1 ? (clearn === 1 ? true : false) : '')
                .field('complement', opt === 1 ? complement : '')
                .field('reverse', opt === 1 ? reverse : '')
                .field('name', opt === 1 ? name : '')
                .field('email', opt === 1 ? email : '')
                .field('s0type', s0type)
                .field('s1type', s1type)
                .field('s0input', s0type === 1 ? 'AF133821.1' : textInputs.s0input)
                .field('s0edge', '*')
                .field('s1edge', '*')
                .attach('s1input', s1FilePath)
        } else {
            response = await request(app)
                .post('/alignments')
                .field('extension', extension)
                .field('clearn', opt === 1 ? (clearn === 1 ? true : false) : '')
                .field('complement', opt === 1 ? complement : '')
                .field('reverse', opt === 1 ? reverse : '')
                .field('name', opt === 1 ? name : '')
                .field('email', opt === 1 ? email : '')
                .field('s0type', s0type)
                .field('s1type', s1type)
                .field('s0edge', '*')
                .field('s1edge', '*')
                .attach('s0input', s0FilePath)
                .attach('s1input', s1FilePath)
        }
    });

    it('should create a new alignment', async () => {
        expect(response.status).toBe(200);
    });

    it('should create the s0 sequence file on the server', async () => {
        const { s0 } = response.body;

        const s0file = path.resolve(__dirname, '..', '..', '..', 'uploads', s0);

        const s0exists = await fsmz.exists(s0file);
        
        expect(s0exists).toBe(true);
    });

    it('should create the s1 sequence file on the server', async () => {
        const { s1 } = response.body

        const s1file = path.resolve(__dirname, '..', '..', '..', 'uploads', s1);

        const s1exists = await fsmz.exists(s1file);

        expect(s1exists).toBe(true);
    });
});

describe('Perform a new Alignment (Sad Paths)', () => {
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
        
        const { s0, s1 } = response.body.message;

        expect(response.status).toBe(400);
        expect(s0.error).toBe('Invalid NCBI Sequence ID.');
        expect(s1.error).toBe('Invalid NCBI Sequence ID.');
    });

    it('should return a 400 status code if the NCBI API is select, but an invalid ID is passed', async () => {
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

        const { s0, s1 } = response.body.message;

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

        const { s0, s1 } = response.body.message;

        expect(response.status).toBe(400);
        expect(s0.error).toBe('FASTA file was not uploaded.');
        expect(s1.error).toBe('FASTA file was not uploaded.');
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

        const { s0, s1 } = response.body.message;

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

        const { s0, s1 } = response.body.message;

        expect(response.status).toBe(400);
        expect(s0.error).toBe('Sequence is not FASTA type.');
        expect(s1.error).toBe('Sequence is not FASTA type.');
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

        const { s0, s1 } = response.body.message;

        expect(response.status).toBe(400);
        expect(s0.error).toBe('Sequence is not FASTA type.');
        expect(s1.error).toBe('Sequence is not FASTA type.');
    });

    it('should return a 400 status code if the \'extension\' is null', async () => {
        const response = await request(app)
            .post('/alignments')
            .send({
                extension: null,
                s0type: '1',
                s1type: '1',
                s0input: 'AF133821.1',
                s1input: 'AY352275.1',
                s0edge: '*',
                s1edge: '*',
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('"extension" must be a number');
    });

    it('should return a 400 status code if the \'extension\' is less than zero or bigger than three', async () => {
        const values = [-312, -56, 0, 4, 742, 1023];

        values.forEach(async value => {
            const response = await request(app)
            .post('/alignments')
            .send({
                extension: value,
                s0type: '1',
                s1type: '1',
                s0input: 'AF133821.1',
                s1input: 'AY352275.1',
                s0edge: '*',
                s1edge: '*',
            });

            expect(response.status).toBe(400);
            
            if(value < 1)
                expect(response.body.message).toBe('"extension" must be larger than or equal to 1');
            else
                expect(response.body.message).toBe('"extension" must be less than or equal to 3');
        });
    });

    it('should return a 400 status code if the \'s_edge\' is null', async () => {
        for(let i = 0; i < 2; i++){
            const response = await request(app)
                .post('/alignments')
                .send({
                    extension: Math.floor(Math.random() * 3) + 1,
                    s0type: '1',
                    s1type: '1',
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
                        s0type: '1',
                        s1type: '1',
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

    it('should return a 400 status code if the \'s_type\' is null', async () => {
        for(let i = 0; i < 2; i++){
            const response = await request(app)
                .post('/alignments')
                .send({
                    extension: Math.floor(Math.random() * 3) + 1,
                    s0type: i === 0 ? null : Math.floor(Math.random() * 3) + 1,
                    s1type: i === 1 ? null : Math.floor(Math.random() * 3) + 1,
                    s0input: 'AF133821.1',
                    s1input: 'AY352275.1',
                    s0edge: '+',
                    s1edge: '+',
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe(`"s${String(i)}type" must be a number`);
        }
    });

    it('should return a 400 status code if the \'s_type\' is less than zero or bigger than three', async () => {
        const values = [-281, -62, 0, 4, 918, 1284];

        for(let i = 0; i < 2; i++){
            values.forEach(async value => {
                const response = await request(app)
                    .post('/alignments')
                    .send({
                        extension: Math.floor(Math.random() * 3) + 1,
                        s0type: i === 0 ? value : Math.floor(Math.random() * 3) + 1,
                        s1type: i === 1 ? value : Math.floor(Math.random() * 3) + 1,
                        s0input: 'AF133821.1',
                        s1input: 'AY352275.1',
                        s0edge: '+',
                        s1edge: '+'
                    });

                expect(response.status).toBe(400);
                
                if(value < 1)
                    expect(response.body.message).toBe(`"s${i}type" must be larger than or equal to 1`);
                else
                    expect(response.body.message).toBe(`"s${i}type" must be less than or equal to 3`);
            });
        }
    });

    it('should return a 400 status code if the \'clearn\' is not a boolean value', async () => {
        //
    });

    afterAll(async () => {
        await Alignment.deleteMany({});

        const uploads = path.resolve(__dirname, '..', '..', '..', 'uploads');
        const results = path.resolve(__dirname, '..', '..', '..', 'results');

        await exec(`rm -rf ${uploads}/*`);
        await exec(`rm -rf ${results}/*`);
    })
});

describe('Show data of an Alignment', () => {
    const files = path.resolve(__dirname, '..', '..', 'utils');
    const s0FilePath = `${files}/AF133821.1.fasta`;
    const s1FilePath = `${files}/AY352275.1.fasta`;
    
    const aExtension = Math.floor(Math.random() * 3) + 1;
    const aS0type = Math.floor(Math.random() * 3) + 1;
    const aS1type = Math.floor(Math.random() * 3) + 1;
    
    let aResponse;

    beforeAll(async () => {
        await Alignment.deleteMany({});
        
        if(aS0type !== 2 && aS1type !== 2){
            aResponse = await request(app)
                .post('/alignments')
                .field('extension', aExtension)
                .field('s0type', aS0type)
                .field('s1type', aS1type)
                .field('s0input', aS0type === 1 ? 'AF133821.1' : textInputs.s0input)
                .field('s1input', aS1type === 1 ? 'AY352275.1' : textInputs.s1input)
                .field('s0edge', '*')
                .field('s1edge', '*')
        } else if(aS0type === 2 && aS1type !== 2) {
            aResponse = await request(app)
                .post('/alignments')
                .field('extension', aExtension)
                .field('s0type', aS0type)
                .field('s1type', aS1type)
                .field('s1input', aS1type === 1 ? 'AY352275.1' : textInputs.s1input)
                .field('s0edge', '*')
                .field('s1edge', '*')
                .attach('s0input', s0FilePath)
        } else if(aS0type !== 2 && aS1type === 2) {
            aResponse = await request(app)
                .post('/alignments')
                .field('extension', aExtension)
                .field('s0type', aS0type)
                .field('s1type', aS1type)
                .field('s0input', aS0type === 1 ? 'AF133821.1' : textInputs.s0input)
                .field('s0edge', '*')
                .field('s1edge', '*')
                .attach('s1input', s1FilePath)
        } else {
            aResponse = await request(app)
                .post('/alignments')
                .field('extension', aExtension)
                .field('s0type', aS0type)
                .field('s1type', aS1type)
                .field('s0edge', '*')
                .field('s1edge', '*')
                .attach('s0input', s0FilePath)
                .attach('s1input', s1FilePath)
        }
    });

    it('should return the data (extension, types, edges and sequence filenames) of an Alignment', async () => {
        const response = await request(app).get(`/alignments/${aResponse.body._id}`);
        
        const { extension, s0type, s1type, s0edge, s1edge } = response.body;

        expect(response.status).toBe(200);
        expect(extension).toBe(aExtension);
        expect(s0type).toBe(aS0type);
        expect(s1type).toBe(aS1type);
        expect(s0edge).toBe('*');
        expect(s1edge).toBe('*');
    });

    it('should return a 400 status code, if the requested Alignment does not exist', async () => {
        const values = [1, null];

        values.forEach(async value => {
            const response = await request(app).get(`/alignments/1`);

            expect(response.status).toBe(400);
        });
    });

    afterAll(async () => {
        await Alignment.deleteMany({});

        const uploads = path.resolve(__dirname, '..', '..', '..', 'uploads');
        const results = path.resolve(__dirname, '..', '..', '..', 'results');

        await exec(`rm -rf ${uploads}/*`);
        await exec(`rm -rf ${results}/*`);
    });
});