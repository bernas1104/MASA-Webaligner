const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const { uuid, isUuid } = require('uuidv4');
const mz = require('mz/fs');

const GetFileNameService = require(
    '../../../src/services/GetFileNameService'
);

const AppError = require('../../../src/errors/AppError');

describe('', () => {
    jest.setTimeout(10000);

    const getFileNameService = new GetFileNameService();

    const filesPath = path.resolve(__dirname, '..', '..', 'uploads');

    const filename = uuid();

    const ncbiFile = 'AF133821.1';
    let files = {};
    let userInput;

    beforeAll(async () => {
        const data = fs.readFileSync(
            path.resolve(__dirname, '..', '..', 'utils', 'AF133821.1.fasta'),
            'utf-8',
        );
        fs.writeFileSync(path.join(filesPath, filename), data);

        files.s0input = [{ filename: path.resolve(path.join(filesPath, filename)) }];
        files.s1input = [{ filename: path.resolve(path.join(filesPath, filename)) }];

        userInput = fs.readFileSync(path.join(filesPath, filename), 'utf-8');
    });

    it('should return the name of the file uploaded if \'num\' is an integer' +
        'between 0 and 1 and \'type\' is an integer between 1 and 3', async () => {
        for(let i = 0; i < 2; i++){
            for(let j = 1; j <= 3; j++){
                const name = await getFileNameService.execute({
                    num: i,
                    type: j,
                    input: j === 1 ? ncbiFile
                        : j === 3 ? userInput : '',
                    files: j === 2 ? files : [],
                });

                const basename = path.parse(name).name;
                const check = await mz.exists(
                    j !== 2 ?
                    path.join(filesPath, basename + '.fasta') :
                    path.join(filesPath, filename)
                );

                if(j === 2){
                    expect(basename).toBe(filename);
                } else {
                    expect(isUuid(basename)).toBe(true);
                }

                expect(check).toBe(true);
            }
        }
    });

    it('should throw an error if \'num\' is not 0 or 1 and \'type\' is equal to 2', async () => {
        const nums = [null, -1, 2, {}];

        for(let i = 0; i < nums.length; i++){
            try {
                await getFileNameService.execute({
                    num: nums[i],
                    type: 2,
                    files,
                })
            } catch (err) {
                expect(err instanceof AppError).toBe(true);
            }
        }
    });

    it('should throw an error if \'input\' is not in FASTA format', async () => {
        const inputs = [
            'loremipsum',
            fs.readFileSync(
                path.resolve(__dirname, '..', '..', 'utils', 'bernas1.fasta'),
                'utf-8',
            ),
        ];

        try {
            await getFileNameService.execute({
                num: Math.floor(Math.random() * 2),
                type: 1,
                input: inputs[0],
                files,
            });
        } catch (err) {
            expect(err instanceof AppError).toBe(true);
        }

        try {
            await getFileNameService.execute({
                num: Math.floor(Math.random() * 2),
                type: 3,
                input: inputs[1],
                files,
            });
        } catch (err) {
            expect(err instanceof AppError).toBe(true);
        }
    });

    afterAll(async () => {
        await execSync(`rm ${path.join(filesPath, '*')}`);
    });
});
