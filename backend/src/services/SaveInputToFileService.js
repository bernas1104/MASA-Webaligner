const path = require('path');
const fs = require('fs');
const { uuid } = require('uuidv4');
require('dotenv').config({
    path: process.env.NODE_ENV === 'test' ? ".env.test" : '.env'
});

class SaveInputToFileService {
  execute({ text }) {
    const filePath = process.env.NODE_ENV !== 'test' ?
        path.resolve(__dirname, '..', '..', 'uploads', `${uuid()}.fasta`) :
        path.resolve(__dirname, '..', '..', '__tests__', 'uploads', `${uuid()}.fasta`);
    fs.writeFileSync(filePath, text);

    return path.basename(filePath);
  }
}

module.exports = SaveInputToFileService;
