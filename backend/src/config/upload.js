const multer = require('multer');
const path = require('path');

module.exports = {
    storage: multer.diskStorage({
        destination: path.resolve(__dirname, '..', '..', 'uploads'),
        filename: (req, file, cb) => {
            const { user_id } = req.headers;
            const ext = path.extname(file.originalname);
            cb(null, `${user_id}-${Date.now()}${ext}`);
        },
    }),
};