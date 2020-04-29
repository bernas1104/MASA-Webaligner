const path = require('path');
const exec = require('child_process').execSync;
require('dotenv').config({
    path: process.env.NODE_ENV === 'test' ? ".env.test" : '.env'
});

class DeleteUploadedFileService {
    async execute({ fileName }){
        const filePath = process.env.NODE_ENV !== 'test' ?
            path.resolve(__dirname, '..', '..', 'uploads', fileName) :
            path.resolve(__dirname, '..', '..', '__tests__', 'uploads', fileName);
        await exec(`rm ${filePath}`);
    }
}

module.exports = DeleteUploadedFileService;
