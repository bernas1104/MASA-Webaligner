const Alignment = require('../models/Alignment');

const path = require('path');
const fs = require('fs');

module.exports = {
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