const Alignment = require('../models/Alignment');
const User = require('../models/User');

const path = require('path');
const fs = require('fs');
const axios = require('axios');
const { exec } = require('child_process');

// Sequences filename for MASA CUDAlign/OpenMP
var s0file;
var s1file;

module.exports = {
    async create(req, res) {
        const { extension, s0type, s1type, s0edge, s1edge,
                s0name, s1name, s0text, s1text } = req.body;
        const { user_id } = req.headers;

        const s0 = await getSequenceName(0, user_id, s0type, s0name, req.files, s0text);    // Gets the s0 sequence name
        const s1 = await getSequenceName(1, user_id, s1type, s1name, req.files, s1text);    // Gets the s1 sequence name

        // Executes the alignment tool
        // extension === 1 => CUDAlign; extension === 2 => OpenMP
        const filesPath = path.resolve(__dirname, '..', '..', 'uploads');
        if(extension === '1')
            await exec(`cudalign --alignment-edges=${s0edge}${s1edge} ${filesPath}/${s0file} ${filesPath}/${s1file} -d ${filesPath}/${s0file}-${s1file}`);
        if(extension === '2')
            await exec(`masa-openmp --alignment-edges=${s0edge}${s1edge} ${filesPath}/${s0file} ${filesPath}/${s1file} -d ${filesPath}/${s0file}-${s1file}`);

        const binPath = path.resolve(__dirname, '..', '..', 'uploads', `${s0file}-${s1file}`, 'alignment.00.txt');

        const alignment = await Alignment.create({ extension, s0type, s1type,               // Creates the alignment
                                                   s0edge, s1edge, s0, s1, alignmentFile: binPath });

        await User.updateOne({ _id: user_id }, {                                            // Adds the new alignment to the user who requested it
            $push: { alignments: alignment._id },
        });

        return res.json(alignment);                                                         // Returns the new created alignment
    },

    async show(req, res) {
        const { id } = req.params;                                                          // Gets the Alignment id from the request
        const alignment = await Alignment.findById(id);                                     // Finds the Alignment
        return res.json(alignment);                                                         // Returns it as JSON
    }
}

async function getSequenceName(num, id, type, sName = '', files = [], input = ''){
    const filePath = path.resolve(__dirname, '..', '..', 'uploads');                        // Gets the uploads folder path
    let data;
    let fileName;

    switch(type){
        case '1':                                                                           // NCBI API fetching
            fileName = await downloadNCBIFile(id, sName);                                       // Downloads the DNA sequence and return its file name
            data = fs.readFileSync(`${filePath}/${fileName}`, 'utf-8');                         // Reads the file
            break;
        case '2':                                                                           // Uploaded sequence
            fileName = files[num].filename;                                                     // Retrieve the uploaded file name
            data = fs.readFileSync(`${filePath}/${files[num].filename}`, 'utf-8');              // Reads the file
            break;
        case '3':                                                                           // Manual sequence input
            fileName = saveInputToFile(id, input);                                              // Retrieve the input sequence name
            data = fs.readFileSync(`${filePath}/${fileName}`, 'utf-8');                         // Reads the file
            break;
    }

    if(num === 0) s0file = fileName;                                                        // Saves the s0 file name for the alignment tool
    if(num === 1) s1file = fileName;                                                        // Saves the s1 file name for the alignment tool

    let sequenceName = data.match(/[A-Z]{2}_?[0-9]+\.[0-9]/g);                              // Tries to match the sequence name
    if(sequenceName) return sequenceName[0];                                                // If matches, return
    else return `deafault-sequence-${num}`;                                                 // Else, returns a default name
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