const path = require('path');
const fs = require('fs');
const axios = require('axios');

const checkFastaFormat = require('../validations/checkFastaFormat');
const deleteUploadedFile = require('./deleteUploadedFile');

async function getFileName(num, type, sInput = '', files = []){
    let fileName;

    const rand = Math.floor(Math.random() * (999999 - 1 + 1)) + 1;

    switch(type){
        case 1:
            if(sInput === '')
                throw Error('Invalid NCBI Sequence ID.');

            try {
                fileName = await downloadNCBIFile(rand, sInput);
            } catch (err) {
                throw err;
            }

            break;
        case 2:
            const file = files[`s${num}input`];

            if(file === undefined)
                throw new Error('FASTA file was not uploaded.');
            
            fileName = file[0].filename;

            const filePath = path.resolve(__dirname, '..', '..', 'uploads', fileName);
            const fileData = fs.readFileSync(filePath, 'utf-8');
            
            if(checkFastaFormat(fileData) === false)
                throw new Error('Sequence is not FASTA type.');

            break;
        case 3:
            if(checkFastaFormat(sInput) === false)
                throw new Error('Sequence is not FASTA type.');
            fileName = saveInputToFile(rand, sInput);
            
            break;
        default:
            throw new Error('Type must be a number between 1 and 3.');
    }

    return fileName;
}

async function downloadNCBIFile(id, sName){
    const filePath = path.resolve(__dirname, '..', '..', `uploads/${id}-${Date.now()}.fasta`);
    const writer = fs.createWriteStream(filePath);
    try{
        const response = await axios({
            url: `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=nucleotide&id=${sName}&rettype=fasta`,
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
        deleteUploadedFile(filePath);
        throw new Error('Invalid NCBI Sequence ID.');
    }
}

function saveInputToFile(id, sText){
    const filePath = path.resolve(__dirname, '..', '..', `uploads/${id}-${Date.now()}.fasta`);
    fs.writeFileSync(filePath, sText);

    return path.basename(filePath);
}

function selectMASAExtension(extension, filesPath, s0, s1) {
    let masa;
    
    if(extension === 1)
            masa = 'cudalign';
    else if(extension === 2)
        masa = 'masa-openmp';
    else {
        var { size } = fs.statSync(`${filesPath}/${s0}`);
        const s0size = size;

        var { size } = fs.statSync(`${filesPath}/${s1}`);
        const s1size = size;

        if(s0size <= 1000000 && s1size <= 1000000) {
            masa = 'masa-openmp';
        } else {
            masa = 'cudalign';
        }
    }

    return masa;
}

module.exports = { getFileName, downloadNCBIFile, saveInputToFile, selectMASAExtension };