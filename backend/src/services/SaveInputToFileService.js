const path = require('path');
const fs = require('fs');
require('dotenv').config({
    path: process.env.NODE_ENV === 'test' ? ".env.test" : '.env'
});

class SaveInputToFileService {
  execute({ id, text }) {
    const filePath = process.env.NODE_ENV !== 'test' ?
        path.resolve(__dirname, '..', '..', 'uploads', `${id}.fasta`) :
        path.resolve(__dirname, '..', '..', '__tests__', 'uploads', `${id}.fasta`);
    fs.writeFileSync(filePath, text);

    return path.basename(filePath);
  }
}

module.exports = SaveInputToFileService;
