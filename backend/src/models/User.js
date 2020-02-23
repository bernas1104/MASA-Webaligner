const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: String,
    alignmentsCounter: {
        type: Number,
        default: 0,
    },
    alignments: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Alignment',
        default: [],
    }
});

module.exports = mongoose.model('User', UserSchema);