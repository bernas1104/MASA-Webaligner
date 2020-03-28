const path = require('path');
const { exec } = require('child_process');

const Alignment = require('../models/Alignment');
const deleteUploadedFile = require('../helpers/deleteUploadedFile');
const { getFileName } = require('./../helpers/prepareFilesForAlignment');

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

            const message = {}
            if(typeof(s0) === 'object') { message.s0 = s0 }
            if(typeof(s1) === 'object') { message.s1 = s1 }

            return res.status(400).json({
                statusCode: 400,
                error: 'Bad Request',
                message: message,
                validation: {
                    source: 'body',
                    keys: [
                        typeof(s0) === 'object' ? 's0input' : null, 
                        typeof(s1) === 'object' ? 's1input' : null,
                    ].filter(key => key !== null)
                }
            });
        }
    
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