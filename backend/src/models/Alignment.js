const mongoose = require('mongoose');

const AlignmentSchema = new mongoose.Schema({
    extension: Number,
    s0type: Number,
    s1type: Number,
    s0: {
        type: String,
        default: null,
    },
    s1: {
        type: String,
        default: null,
    },
    s0edge: String,
    s1edge: String,
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = mongoose.model('Alignment', AlignmentSchema);