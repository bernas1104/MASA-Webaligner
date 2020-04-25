const path = require('path');
const fs = require('fs');

const CheckFastaFormatService = require('./CheckFastaFormatService');
const DownloadNCBIFileService = require('./DownloadNCBIFileService');
const SaveInputToFileService  = require('./SaveInputToFileService');

class GetFileNameService {
  async execute({ num, type, input = '', files = [] }) {
    let fileName;

    const checkFastaFormatService = new CheckFastaFormatService();
    const downloadNCBIFileService = new DownloadNCBIFileService();

    const rand = Math.floor(Math.random() * (999999 - 1 + 1)) + 1;

    switch(type){
        case 1:
            if(input === '')
                throw Error('Invalid NCBI Sequence ID.');

            try {
                fileName = await downloadNCBIFileService.execute({
                  id: rand,
                  sequence: input,
                });
            } catch (err) {
                throw err;
            }

            break;
        case 2:
            const file = files[`s${num}input`];

            if(file === undefined)
                throw new Error('FASTA file was not uploaded.');

            fileName = file[0].filename;

            const filePath = path.resolve(__dirname, '..', '..', 'uploads', fileName);
            const fileData = fs.readFileSync(filePath, 'utf-8');

            if(checkFastaFormatService.execute({ sequence: fileData }) === false)
                throw new Error('Sequence is not FASTA type.');

            break;
        case 3:
            if(checkFastaFormatService.execute({ sequence: input }) === false)
                throw new Error('Sequence is not FASTA type.');

            const saveInputToFileService = new SaveInputToFileService();

            fileName = saveInputToFileService.execute({ id: rand, text: input});

            break;
        default:
            throw new Error('Type must be a number between 1 and 3.');
    }

    return fileName;
  }
}

module.exports = GetFileNameService;
