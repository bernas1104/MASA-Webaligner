const mongoose = require('mongoose');

const AlignmentSchema = new mongoose.Schema({
    extension: {
        type: Number,
        default: null,
        required: true,
        min: [1, 'Must be a number between 1 and 3.'],
        max: [3, 'Must be a number between 1 and 3.'],
        validate: {
            validator: (extension) => (
                extension !== null ?
                Number.isInteger(extension) :
                true
            )
        }
    },
    clearn: {
        type: Boolean,
        default: false,
        required: false,
        validate: {
            validator: (clearn) => (
                clearn !== null ?
                clearn === true || clearn === false :
                true
            )
        }
    },
    complement: {
        type: Number,
        default: null,
        required: false,
        min: [1, 'Must be a number between 1 and 3.'],
        max: [3, 'Must be a number between 1 and 3.'],
        validate: {
            validator: (complement) => (
                complement !== null ?
                Number.isInteger(complement) :
                true
            )
        }
    },
    reverse: {
        type: Number,
        default: null,
        required: false,
        min: [1, 'Must be a number between 1 and 3.'],
        max: [3, 'Must be a number between 1 and 3.'],
        validate: {
            validator: (reverse) => (
                reverse !== null ?
                Number.isInteger(reverse) :
                true
            )
        }
    },
    blockPruning: {
        type: Boolean,
        default: true,
        required: false,
        validate: {
            validator: (blockPruning) => (
                blockPruning !== null ?
                blockPruning === true || blockPruning === false :
                true
            )
        }
    },
    s0type: {
        type: Number,
        default: null,
        required: true,
        min: [1, 'Must be a number between 1 and 3.'],
        max: [3, 'Must be a number between 1 and 3.'],
        validate: {
            validator: (s0type) => (
                s0type !== null ?
                Number.isInteger(s0type) :
                true
            )
        }
    },
    s1type: {
        type: Number,
        default: null,
        required: true,
        min: [1, 'Must be a number between 1 and 3.'],
        max: [3, 'Must be a number between 1 and 3.'],
        validate: {
            validator: (s1type) => (
                s1type !== null ?
                Number.isInteger(s1type) :
                true
            )
        }
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