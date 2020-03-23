const path = require('path');
const { exec } = require('child_process');

module.exports = {
    checkFastaFormat(sequence){
        // Text Input fails. What's the problem?
        return sequence.match(/^(>[A-Z]{1,2}_?[0-9]{5,6}\.[0-9][\w\d\s/,-]+)?\n[AGCTN\n]+$/g);
    },

    deleteUploadedFile(fileName){
        filePath = path.resolve(__dirname, '..', '..', 'uploads', fileName);
        exec(`rm ${filePath}`);
    }
}