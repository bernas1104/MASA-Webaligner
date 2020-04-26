const multer = require('multer');
const path = require('path');
require('dotenv').config({
    path: process.env.NODE_ENV === 'test' ? ".env.test" : '.env'
});

module.exports = {
    storage: multer.diskStorage({
        destination: process.env.NODE_ENV !== 'test' ?
            path.resolve(__dirname, '..', '..', 'uploads') :
            path.resolve(__dirname, '..', '..', '__tests__', 'uploads'),
        filename: (req, file, cb) => {
            const rand = Math.floor(Math.random() * (999999 - 1 + 1)) + 1;
            const ext = path.extname(file.originalname);
            cb(null, `${rand}-${Date.now()}${ext}`);
        },
    }),
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname);

        if(ext !== '.fasta') { cb(null, false); }

        cb(null, true);
    }
};
