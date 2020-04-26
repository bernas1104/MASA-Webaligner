const path = require('path');
const exec = require('child_process').execSync;

class DeleteUploadedFileService {
    async execute({ fileName }){
        const filePath = path.resolve(__dirname, '..', '..', 'uploads', fileName);
        await exec(`rm ${filePath}`);
    }
}

module.exports = DeleteUploadedFileService;
