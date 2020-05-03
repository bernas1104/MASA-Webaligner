const mongoose = require('mongoose');

const StatisticSchema = new mongoose.Schema({
    alignment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Alignment',
    },
    totalScore: Number,
    matches: Number,
    mismatches: Number,
    gapOpenings: Number,
    gapExtensions: Number,
});