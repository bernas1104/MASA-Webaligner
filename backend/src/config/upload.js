const multer = require('multer');
const path = require('path');

const { checkFastaFormat } = require('./../helpers/checkFastaFormat');

module.exports = {
    storage: multer.diskStorage({
        destination: path.resolve(__dirname, '..', '..', 'uploads'),
        filename: (req, file, cb) => {
            const rand = Math.floor(Math.random() * (999999 - 1 + 1)) + 1;
            const ext = path.extname(file.originalname);
            cb(null, `${rand}-${Date.now()}${ext}`);
        },
    }),
    fileFilter: (req, file, cb) => {
        if(file.fieldname.includes('s0') && req.body.s0type !== '2'){
            cb(null, false);
        } else if(file.fieldname.includes('s1') && req.body.s1type !== '2'){
            cb(null, false);
        } else{
            cb(null, true);
        }
    }
};