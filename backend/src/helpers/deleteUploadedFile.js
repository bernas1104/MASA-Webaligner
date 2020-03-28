const path = require('path');
const exec = require('child_process').execSync;

module.exports = async function deleteUploadedFile(fileName){
    filePath = path.resolve(__dirname, '..', '..', 'uploads', fileName);
    await exec(`rm ${filePath}`);
}