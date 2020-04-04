const mongoose = require('mongoose');

const AlignmentSchema = new mongoose.Schema({
    extension: {
        type: Number,
        default: null,
        required: true,
        min: [1, 'Must be a number between 1 and 3.'],
        max: [3, 'Must be a number between 1 and 3.']
    },
    clearn: {
        type: Boolean,
        default: false,
        required: true,
        validate: {
            validator: (clearn) => (
                clearn === true || clearn === false
            )
        }
    },
    s0type: {
        type: Number,
        default: null,
        required: true,
        min: [1, 'Must be a number between 1 and 3.'],
        max: [3, 'Must be a number between 1 and 3.']
    },
    s1type: {
        type: Number,
        default: null,
        required: true,
        min: [1, 'Must be a number between 1 and 3.'],
        max: [3, 'Must be a number between 1 and 3.']
    },
    s0: {
        type: String,
        default: null,
        required: true
    },
    s1: {
        type: String,
        default: null,
        required: true
    },
    s0edge: {
        type: String,
        default: null,
        required: true,
        validate: {
            validator: (edge) => (
                /(\+|\*|[1-3]{1})/.test(edge)
            ),
            message: () => 'Alignment edge must be one of: *, 1, 2, 3 or +.'
        }
    },
    s1edge: {
        type: String,
        default: null,
        required: true,
        validate: {
            validator: (edge) => (
                /(\+|\*|[1-3]{1})/.test(edge)
            ),
            message: () => 'Alignment edge must be one of: *, 1, 2, 3 or +.'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = mongoose.model('Alignment', AlignmentSchema);