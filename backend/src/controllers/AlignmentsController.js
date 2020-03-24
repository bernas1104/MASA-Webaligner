const Alignment = require('../models/Alignment');
const { checkFastaFormat, deleteUploadedFile } = require('./../helpers/checkFastaFormat');

const path = require('path');
const fs = require('fs');
const axios = require('axios');
const { exec } = require('child_process');

module.exports = {
    async create(req, res) {
        const { extension, s0type, s1type, s0edge, s1edge,
                s0input, s1input } = req.body;
        
        let s0, s1;
        let s0folder, s1folder;
        
        try{
            s0 = await getFileName(0, s0type, s0input, req.files);
            s0folder = s0 !== undefined ? s0.match(/.*[^\.fasta]/g)[0] : null;
        } catch (err) {
            s0 = { error: err.message };
        }
        
        try{
            s1 = await getFileName(1, s1type, s1input, req.files);
            s1folder = s1 !== undefined ? s1.match(/.*[^\.fasta]/g)[0] : null;
        } catch (err) {
            s1 = { error: err.message };
        }

        if(typeof(s0) === 'object' || typeof(s1) === 'object'){
            if(typeof(s0) === 'string')
                deleteUploadedFile(s0);

            if(typeof(s1) === 'string')
                deleteUploadedFile(s1);

            return res.status(400).json({
                s0: typeof(s0) === 'object' ? s0 : null,
                s1: typeof(s1) === 'object' ? s1 : null
            });
        }
        
        try {
            const alignment = await Alignment.create({ extension, s0type, s1type,
                s0edge, s1edge, s0, s1 });

            const filesPath = path.resolve(__dirname, '..', '..', 'uploads');
            const results = path.resolve(__dirname, '..', '..', 'results');
            
            let masa;
            if(extension === '1')
                masa = 'cudalign';
            else
                masa = 'masa-openmp';

            const child = exec(`
                ${masa} --alignment-edges=${s0edge}${s1edge} ${filesPath}/${s0} ${filesPath}/${s1} -d ${results}/${s0folder}-${s1folder} -1 &&
                ${masa} --alignment-edges=${s0edge}${s1edge} ${filesPath}/${s0} ${filesPath}/${s1} -d ${results}/${s0folder}-${s1folder} -2 &&
                ${masa} --alignment-edges=${s0edge}${s1edge} ${filesPath}/${s0} ${filesPath}/${s1} -d ${results}/${s0folder}-${s1folder} -3 &&
                ${masa} --alignment-edges=${s0edge}${s1edge} ${filesPath}/${s0} ${filesPath}/${s1} -d ${results}/${s0folder}-${s1folder} -4 &&
                ${masa} --alignment-edges=${s0edge}${s1edge} ${filesPath}/${s0} ${filesPath}/${s1} -d ${results}/${s0folder}-${s1folder} -5
            `);
            child.on('exit', () => {
                setTimeout(async () => {
                    await Alignment.updateOne({ _id: alignment._id }, { $set: { resultsAvailable: true } });
                }, 1000);
            });

            return res.json(alignment);
        } catch (err) {
            deleteUploadedFile(s0);
            deleteUploadedFile(s1);

            return res.status(400).json(err.errors);
        }
    },

    async show(req, res) {
        const { id } = req.params;

        try{
            const alignment = await Alignment.findById(id);
            return res.json(alignment);
        } catch (err) {
            res.status(400).send(err);
        }
    }
}

// Private Functions
async function getFileName(num, type, sInput = '', files = []){
    let fileName;

    const rand = Math.floor(Math.random() * (999999 - 1 + 1)) + 1;

    switch(type){
        case '1':
            if(sInput === '')
                throw Error('Invalid NCBI Sequence ID.');

            try {
                fileName = await downloadNCBIFile(rand, sInput);
            } catch (err) {
                throw err;
            }

            break;
        case '2':
            const file = files[`s${num}input`];
            fileName = file[0].filename;

            const filePath = path.resolve(__dirname, '..', '..', 'uploads', fileName);
            const fileData = fs.readFileSync(filePath, 'utf-8');
            
            if(checkFastaFormat(fileData) === null){
                exec(`rm ${filePath}`);
                throw new Error('Sequence is not FASTA type.');
            }

            break;
        case '3':
            if(checkFastaFormat(sInput) === null)
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
        throw new Error('Invalid NCBI Sequence ID.');
    }
}

function saveInputToFile(id, sText){
    const filePath = path.resolve(__dirname, '..', '..', `uploads/${id}-${Date.now()}.fasta`);
    fs.writeFileSync(filePath, sText);

    return path.basename(filePath);
}