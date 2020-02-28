const multer = require('multer');
const path = require('path');

module.exports = {
    storage: multer.diskStorage({
        destination: path.resolve(__dirname, '..', '..', 'uploads'),
        filename: (req, file, cb) => {
            const rand = Math.floor(Math.random() * (999999 - 1 + 1)) + 1;
            const ext = path.extname(file.originalname);
            cb(null, `${rand}-${Date.now()}${ext}`);
        },
    }),
};