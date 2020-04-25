const path = require('path');

class DeleteUploadedFileService {
    async execute({ fileName }){
        filePath = path.resolve(__dirname, '..', '..', 'uploads', fileName);
        await exec(`rm ${filePath}`);
    }
}

module.exports = DeleteUploadedFileService;
