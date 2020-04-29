const request = require('supertest');
const path = require('path');
const fs = require('fs-extra');
const { execSync }= require('child_process');

const app = require('./../../../src/server');
require('./../../../src/queue');

const sequelize = require('../../../src/database/connection');

describe('Checks if the alignment is done processing', () => {
    jest.setTimeout(10000);

    let alignment1;

    const results = path.resolve(__dirname, '..', '..', 'results');
    const uploads = path.resolve(__dirname, '..', '..', 'uploads');

    beforeAll(async () => {
        const filesPath = path.resolve(__dirname, '..', '..', 'utils');
        const only1 = Math.floor(Math.random() * 2);

        alignment1 = await request(app)
            .post('/alignments')
            .field('extension', 2)
            .field('only1', only1 === 0 ? false : true)
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

        await new Promise(r => setTimeout(r, 2000));
    });

    it('should return TRUE if the alignment is done processing', async () => {
        const { only1 } = alignment1.body.alignment;
        const { file: s0 } = alignment1.body.sequence0;
        const { file: s1 } = alignment1.body.sequence1;

        const response = await request(app)
            .get(`/alignments-check?s0=${s0}&s1=${s1}&only1=${only1}`);

        const { isReady } = response.body;

        expect(response.status).toBe(200);
        expect(isReady).toBe(true);
    });

    it('should return FALSE if the alignment is not done processing', async () => {
        const { only1 } = alignment1.body.alignment;
        const { file: s0 } = alignment1.body.sequence0;
        const { file: s1 } = alignment1.body.sequence1;

        fs.removeSync(
            path.resolve(
                results,
                path.parse(alignment1.body.sequence0.file).name + '-' +
                path.parse(alignment1.body.sequence1.file).name
            )
        );

        const response = await request(app)
            .get(`/alignments-check?s0=${s0}&s1=${s1}&only1=${only1}`);

        const { isReady } = response.body;

        expect(response.status).toBe(200);
        expect(isReady).toBe(false);
    });

    afterAll(async () => {
        await execSync(`rm ${path.join(uploads, '*')}`);
        await execSync(`rm -rf ${path.join(results, '*')}`);

        await sequelize.close();
    });
});
