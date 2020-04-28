const path = require('path');
const fs = require('fs');
const axios = require('axios');
require('dotenv').config({
    path: process.env.NODE_ENV === 'test' ? ".env.test" : '.env'
});

const DeleteUploadedFileService = require('./DeleteUploadedFileService');

const AppError = require('../errors/AppError');

class DownloadNCBIFileService {
  async execute({ id, sequence }) {
    const filePath = process.env.NODE_ENV !== 'test' ?
        path.resolve(__dirname, '..', '..', 'uploads', `${id}.fasta`) :
        path.resolve(__dirname, '..', '..', '__tests__', 'uploads', `${id}.fasta`);
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
        throw new AppError('Invalid NCBI Sequence ID.');
    }
  }
}

module.exports = DownloadNCBIFileService;
