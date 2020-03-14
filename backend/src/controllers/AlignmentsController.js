const Alignment = require('../models/Alignment');

const path = require('path');
const fs = require('fs');
const axios = require('axios');
const { exec } = require('child_process');

module.exports = {
    async create(req, res) {
        const { extension, s0type, s1type, s0edge, s1edge,
                s0input, s1input } = req.body;

        const s0 = await getFileName(0, s0type, s0input, req.files);                                                // Gets the s0 sequence name
        const s1 = await getFileName(1, s1type, s1input, req.files);                                                // Gets the s1 sequence name
        const s0folder = s0.match(/.*[^\.fasta]/g)[0];                                                              // Gets the filename minus .fasta
        const s1folder = s1.match(/.*[^\.fasta]/g)[0];                                                              // Gets the filename minus .fasta

        // Executes the alignment tool
        // extension === 1 => CUDAlign; extension === 2 => OpenMP
        const filesPath = path.resolve(__dirname, '..', '..', 'uploads');
        const results = path.resolve(__dirname, '..', '..', 'results');
        if(extension === '1')
            await exec(`cudalign --alignment-edges=${s0edge}${s1edge} ${filesPath}/${s0} ${filesPath}/${s1} -d ${results}/${s0folder}-${s1folder}`);
        if(extension === '2')
            await exec(`masa-openmp --alignment-edges=${s0edge}${s1edge} ${filesPath}/${s0} ${filesPath}/${s1} -d ${results}/${s0folder}-${s1folder}`);

        const alignment = await Alignment.create({ extension, s0type, s1type,                                       // Creates the alignment
                                                   s0edge, s1edge, s0, s1 });

        return res.json(alignment);                                                                                 // Returns the new created alignment
    },

    async show(req, res) {
        const { id } = req.params;                                                                                  // Gets the Alignment id from the request

        try{
            const alignment = await Alignment.findById(id, '_id');                                                  // Finds the Alignment
            return res.json(alignment);                                                                             // Returns it as JSON
        } catch (err) {
            res.status(400).send(err);
        }
    }
}

// Private Functions

async function getFileName(num, type, sInput = '', files = []){
    let fileName;

    const rand = Math.floor(Math.random() * (999999 - 1 + 1)) + 1;                                                  // Random number to compose the filename

    switch(type){
        case '1':                                                                                                   // NCBI API fetching
            fileName = await downloadNCBIFile(rand, sInput);                                                            // Downloads the DNA sequence and return its file name
            break;
        case '2':                                                                                                   // Uploaded sequence
            // Retrieves the filename of the s0upload file
            if(num === 0){
                const { s0input } = files;
                fileName = s0input[0].filename;
            }

            // Retrieves the filename of the s1upload file
            if(num === 1){
                const { s1input } = files;
                fileName = s1input[0].filename;
            }
            break;
        case '3':                                                                                                   // Manual sequence input
            fileName = saveInputToFile(rand, sInput);                                                                   // Retrieve the input sequence name
            break;
    }

    return fileName;
}

async function downloadNCBIFile(id, sName){
    const filePath = path.resolve(__dirname, '..', '..', `uploads/${id}-${Date.now()}.fasta`);                      // Resolves the folder and filename
    const writer = fs.createWriteStream(filePath);                                                                  // Creates the write stream
    
    const response = await axios({                                                                                  // Fetches the sequence file from the NCBI API
        url: `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=nucleotide&id=${sName}&rettype=fasta`,
        method: 'GET',
        responseType: 'stream',
    });

    response.data.pipe(writer);                                                                                     // Writes the stream to the file

    let name;
    await new Promise((resolve, reject) => {                                                                        // Resolves or Rejects the stream
        writer.on('finish', () => {
            name = path.basename(filePath);                                                                             // On resolving, gets the filename
            resolve();
        });
        writer.on('error', reject);
    });

    return name;                                                                                                    // Returns the filename
}

function saveInputToFile(id, sText){
    const filePath = path.resolve(__dirname, '..', '..', `uploads/${id}-${Date.now()}.fasta`);                      // Resolves the folder and filename
    fs.writeFileSync(filePath, sText);                                                                              // Writes the data to the file

    return path.basename(filePath);                                                                                 // Returns the filename
}