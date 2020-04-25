const path = require('path');
const fs = require('fs');

class SaveInputToFileService {
  execute({ id, text }) {
    const filePath = path.resolve(__dirname, '..', '..', `uploads/${id}-${Date.now()}.fasta`);
    fs.writeFileSync(filePath, text);

    return path.basename(filePath);
  }
}

module.exports = SaveInputToFileService;
