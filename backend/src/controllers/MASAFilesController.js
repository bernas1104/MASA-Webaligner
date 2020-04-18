const path = require('path');
const fs = require('fs');
const mz = require('mz/fs');

const Alignment = require('../models/Alignment');
const getBestInformation = require('../helpers/getBestInformation');

module.exports = {
    async isAlignmentReady(req, res){
        const { s0, s1, only1 } = req.query;

        let isReady;
        let filePath = path.resolve(__dirname, '..', '..', 'results', path.parse(s0).name + '-' + path.parse(s1).name);

        if(!only1){
            filePath = path.join(filePath, 'alignment.00.bin');

            isReady = await mz.exists(filePath);

            res.json({isReady});
        } else {
            filePath = path.join(filePath, 'statistics_01.00');

            isReady = await mz.exists(filePath);

            res.json({isReady});
        }
    },

    async fetchStage1(req, res){
        const { id } = req.params;
        
        try {
            const alignment = await Alignment.findById(id);

            const { s0, s1 } = alignment;
            const filePath = path.resolve(__dirname, '..', '..', 'results', path.parse(s0).name + '-' + path.parse(s1).name, 'statistics_01.00');

            const data = fs.readFileSync(filePath, 'utf-8').split('\n');
            
            const response = getBestInformation(data);

            return res.json(response);
        } catch (err) {
            return res.status(400).json(err);
        }
    },

    async fetchBinary(req, res){
        const { id } = req.params;

        let alignment;
        try {
            alignment = await Alignment.findById(id, 's0 s1');

            const { s0, s1 } = alignment;
            const folder = s0.match(/.*[^\.fasta]/g) + '-' + s1.match(/.*[^\.fasta]/g);
            const filePath = path.resolve(__dirname, '..', '..', 'results', folder, 'alignment.00.bin');
            let file;
            
            try {
                file = fs.readFileSync(filePath);
                res.status(200).json(file);
            } catch (err) {
                res.status(500).send(err);
            }
        } catch (err) {
            res.status(400).send(err);
        }
    },

    async fetchFasta(req, res){
        const { id } = req.params;

        let alignment;
        try {
            alignment = await Alignment.findById(id, 's0 s1');

            const { s0, s1 }= alignment;
            const filesPath = path.resolve(__dirname, '..', '..', 'uploads');

            try {
                const s0file = fs.readFileSync(filesPath + '/' + s0, 'utf-8');
                const s1file = fs.readFileSync(filesPath + '/' + s1, 'utf-8');

                res.status(200).json({ s0file, s1file });
            } catch (err) {
                res.status(500).send(err);
            }
        } catch (err) {
            res.status(400).send(err);
        }
    }
}