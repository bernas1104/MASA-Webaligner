const path = require('path');
const fs = require('fs');
const axios = require('axios');

const DeleteUploadedFileService = require('./DeleteUploadedFileService');

class DownloadNCBIFileService {
  async execute({ id, sequence }) {
    const filePath = path.resolve(__dirname, '..', '..', `uploads/${id}-${Date.now()}.fasta`);
    const writer = fs.createWriteStream(filePath);
    try{
        const response = await axios({
            url: `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=nucleotide&id=${sequence}&rettype=fasta`,
            method: 'GET',
            responseType: 'stream',
        });

        response.data.pipe(writer);

        let name;
        await new Promise((resolve, reject) => {
            writer.on('finish', () => {
                name = path.basename(filePath);
                resolve();
            });
            writer.on('error', reject);
        });

        return name;
    } catch (err) {
        const deleteUploadedFileService = new DeleteUploadedFileService();
        deleteUploadedFileService.execute({ fileName: filePath });
        throw new Error('Invalid NCBI Sequence ID.');
    }
  }
}

module.exports = DownloadNCBIFileService;
