const request = require('supertest');
const path = require('path');
const fs = require('fs-extra');
const { execSync } = require('child_process');
const { uuid } = require('uuidv4');

const app = require('./../../../src/server');
require('./../../../src/queue');

const Alignment = require('./../../../src/models/Alignment');

const sequelize = require('../../../src/database/connection');

describe('Fetch Binary Files', () => {
    jest.setTimeout(10000);

    let alignment;

    const results = path.resolve(__dirname, '..', '..', 'results');
    const uploads = path.resolve(__dirname, '..', '..', 'uploads');

    beforeEach(async () => {
        const filesPath = path.resolve(__dirname, '..', '..', 'utils');

        alignment = await request(app)
            .post('/alignments')
            .field('extension', 2)
            .field('s0origin', 3)
            .field('s1origin', 3)
            .field('s0input', fs.readFileSync(
                path.join(filesPath, 'AF133821.1.fasta'),
                'utf-8',
            ))
            .field('s1input', fs.readFileSync(
                path.join(filesPath, 'AY352275.1.fasta'),
                'utf-8',
            ))
            .field('s0edge', '*')
            .field('s1edge', '*');

        await new Promise(r => setTimeout(r, 5000));
    });

    it('should return the contents of the \'.bin\' file created by the MASA Alignment Tool (Happy Path)', async () => {
        const response = await request(app)
            .get(`/files/bin/${alignment.body.alignment.id}`);

        expect(response.status).toBe(200);
        expect(response.body).not.toBeFalsy();
    });

    it('should return a status code 500, if the requested \'.bin\' is for an non-existent Alignment', async () => {
        const response = await request(app).get(`/files/bin/${uuid()}`);

        expect(response.status).toBe(500);
    });

    it('should return a status code 500, if the requested \'.bin\' cannot be fetched', async () => {
        const {
            sequence0: { file: s0 },
            sequence1: { file: s1 }
        } = alignment.body;

        fs.unlinkSync(
            path.resolve(
                results,
                path.parse(s0).name + '-' +
                path.parse(s1).name,
            'alignment.00.bin')
        );

        const response = await request(app)
            .get(`/files/bin/${alignment.body.alignment.id}`);

        expect(response.status).toBe(500);
    });

    afterAll(async () => {
        await Alignment.destroy({ truncate: true, cascade: true });

        await execSync(`rm ${path.join(uploads, '*')}`);
        await execSync(`rm -rf ${path.join(results, '*')}`);
    });
});

describe('Fetch Fasta Files', () => {
    jest.setTimeout(10000);

    var alignment;

    const results = path.resolve(__dirname, '..', '..', 'results');
    const uploads = path.resolve(__dirname, '..', '..', 'uploads');

    beforeEach(async () => {
        const filesPath = path.resolve(__dirname, '..', '..', 'utils');

        alignment = await request(app)
            .post('/alignments')
            .field('extension', 2)
            .field('s0origin', 3)
            .field('s1origin', 3)
            .field('s0input', fs.readFileSync(
                path.join(filesPath, 'AF133821.1.fasta'),
                'utf-8',
            ))
            .field('s1input', fs.readFileSync(
                path.join(filesPath, 'AY352275.1.fasta'),
                'utf-8',
            ))
            .field('s0edge', '*')
            .field('s1edge', '*');

        await new Promise(r => setTimeout(r, 5000));
    });

    it('should return the contents of the \'.fasta\' files created by the Alignment request (Happy Path)', async () => {
        const response = await request(app).get(`/files/fasta/${alignment.body.alignment.id}`);

        const { s0file, s1file } = response.body;

        expect(response.status).toBe(200);

        expect(s0file).not.toBeFalsy();
        expect(s1file).not.toBeFalsy();
    });

    it('should return a 500 status code, if the requested \'.fasta\' files are for an non-existent Alignment', async () => {
        const response = await request(app).get(`/files/fasta/${uuid()}`);

        expect(response.status).toBe(500);
    });

    it('should return a 500 status code, if the requested \'.fasta\' files cannot be fetched', async () => {
        const {
            sequence0: { file: s0 },
            sequence1: { file: s1 }
        } = alignment.body;

        fs.unlinkSync(path.join(uploads, s0));
        fs.unlinkSync(path.join(uploads, s1));

        const response = await request(app).get(`/files/fasta/${alignment.body.alignment.id}`);

        expect(response.status).toBe(500);
    });

    afterAll(async () => {
        await Alignment.destroy({ truncate: true, cascade: true });

        await execSync(`rm ${path.join(uploads, '*')}`);
        await execSync(`rm -rf ${path.join(results, '*')}`);
    });
});

describe('Fetch Stage #1 Results', () => {
    jest.setTimeout(10000);

    var alignment;

    const results = path.resolve(__dirname, '..', '..', 'results');
    const uploads = path.resolve(__dirname, '..', '..', 'uploads');

    beforeEach(async () => {
        const filesPath = path.resolve(__dirname, '..', '..', 'utils');

        alignment = await request(app)
            .post('/alignments')
            .field('extension', 1)
            .field('only1', true)
            .field('s0origin', 3)
            .field('s1origin', 3)
            .field('s0input', fs.readFileSync(
                path.join(filesPath, 'AF133821.1.fasta'),
                'utf-8',
            ))
            .field('s1input', fs.readFileSync(
                path.join(filesPath, 'AY352275.1.fasta'),
                'utf-8',
            ))
            .field('s0edge', '*')
            .field('s1edge', '*');

        await new Promise(r => setTimeout(r, 5000));
    });

    it('should return the contents of the Stage I Alignment', async () => {
        const response = await request(app).get(`/files/stage-i/${alignment.body.alignment.id}`);

        expect(response.status).toBe(200);

        const { bestScore, bestPosition } = response.body.bestScoreInformation;

        expect(typeof(bestScore)).toBe('number');
        expect(typeof(bestPosition[0])).toBe('number');
        expect(typeof(bestPosition[1])).toBe('number');
    });

    afterAll(async () => {
        await Alignment.destroy({ truncate: true, cascade: true });

        await execSync(`rm -rf ${path.join(results, '*')}`);
        await execSync(`rm ${path.join(uploads, '*')}`);

        await sequelize.close();
    });
});
