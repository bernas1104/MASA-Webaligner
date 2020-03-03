'use strict';

const fs = require('fs');

const Sequence = require('./Sequence');
const SequenceInfo = require('./SequenceInfo');
const SequenceModifiers = require('./SequenceModifiers');

const Alignment = require('./Alignment');
const AlignmentParams = require('./AlignmentParams');

const Gap = require('./Gap');
const GapList = require('./GapList');

const getKeyByValue = (obj, value) => (
    Object.keys(obj).find(key => obj[key] === value)
);

var byte = 0;

const MAX_STRING_LEN     = 1000

const MAGIC_HEADER       = 'CGFF';
const MAGIC_HEDAER_LEN   = 4;       // in Bytes
const FILE_VERSION_MAJOR = 0;
const FILE_VERSION_MINOR = 1;

const END_OF_FIELDS = 0;

const FIELD_ALIGNMENT_METHOD = 1;
const FIELD_SCORING_SYSTEM   = 2;
const FIELD_PENALTY_SYSTEM   = 3;
const FIELD_SEQUENCE_PARAMS  = 4;

const FIELD_SEQUENCE_DESCRIPTION     = 1;
const FIELD_SEQUENCE_TYPE            = 2;
const FIELD_SEQUENCE_SIZE            = 3;
const FIELD_SEQUENCE_HASH            = 4;
const FIELD_SEQUENCE_DATA_PLAIN      = 5;
const FIELD_SEQUENCE_DATA_COMPRESSED = 6;

const FIELD_RESULT_RAW_SCORE        = 1;
const FIELD_RESULT_BIT_SCORE        = 2;
const FIELD_RESULT_E_VALUE          = 3;
const FIELD_RESULT_SCORE_STATISTICS = 4;
const FIELD_RESULT_GAP_LIST         = 5;
const FIELD_RESULT_BLOCKS           = 6;
const FIELD_RESULT_CELLS            = 7;

const SEQUENCE_TYPE_DNA     = 1;
const SEQUENCE_TYPE_RNA     = 2;
const SEQUENCE_TYPE_PROTEIN = 3;
const SEQUENCE_TYPE_UNKNOWN = 255;
const sequenceType = {
    [SEQUENCE_TYPE_DNA]: getKeyByValue(SequenceInfo.module.SequenceType, SEQUENCE_TYPE_DNA),
    [SEQUENCE_TYPE_RNA]: getKeyByValue(SequenceInfo.module.SequenceType, SEQUENCE_TYPE_RNA),
    [SEQUENCE_TYPE_PROTEIN]: getKeyByValue(SequenceInfo.module.SequenceType, SEQUENCE_TYPE_PROTEIN),
    [SEQUENCE_TYPE_UNKNOWN]: getKeyByValue(SequenceInfo.module.SequenceType, SEQUENCE_TYPE_UNKNOWN)
};

const ALIGNMENT_METHOD_GLOBAL = 1;
const ALIGNMENT_METHOD_LOCAL  = 2;
const alignmentMethod = {
    [ALIGNMENT_METHOD_GLOBAL]: getKeyByValue(AlignmentParams.module.AlignmentMethod, ALIGNMENT_METHOD_GLOBAL),
    [ALIGNMENT_METHOD_LOCAL]: getKeyByValue(AlignmentParams.module.AlignmentMethod, ALIGNMENT_METHOD_LOCAL)
}

const PENALTY_LINEAR_GAP = 1;
const PENALTY_AFFINE_GAP = 2;
const penaltySystem = {
    [PENALTY_AFFINE_GAP]: getKeyByValue(AlignmentParams.module.PenaltySystem, PENALTY_AFFINE_GAP),
    [PENALTY_LINEAR_GAP]: getKeyByValue(AlignmentParams.module.PenaltySystem, PENALTY_LINEAR_GAP)
}

const SCORE_MATCH_MISMATCH = 1;
const SCORE_SIMILARITY_MATRIX = 2;
const scoreSystem = {
    [SCORE_MATCH_MISMATCH]: getKeyByValue(AlignmentParams.module.ScoreSystem, SCORE_MATCH_MISMATCH),
    [SCORE_SIMILARITY_MATRIX]: getKeyByValue(AlignmentParams.module.ScoreSystem, SCORE_SIMILARITY_MATRIX)
}

const read = (file) => {
    const ds = fs.readFileSync('alignment.00.bin'); // Read as bytes
    
    fread_header(ds);

    const sequences = fread_sequences(ds);

    const params = fread_alignment_params(sequences, ds);
    const alignment = new Alignment.module(params);
    fread_alignment_result(alignment, ds);

    console.log(alignment);

    return alignment;
}

function fread_header(is) {
    const header = fread_array(MAGIC_HEDAER_LEN, is);
    
    if(header !== MAGIC_HEADER) throw 'Wrong File Format. Header Error.\n';

    const file_version_major = fread_int1(is);
    const file_version_minor = fread_int1(is);
    if(file_version_major > FILE_VERSION_MAJOR) 
        throw `File Version not supported (${file_version_major}.${file_version_minor} > ${FILE_VERSION_MAJOR}.${FILE_VERSION_MINOR})`;
}

function fread_sequences(is) {
    const count = fread_int4(is);
    let sequences = []
    
    for(let i = 0; i < count; i++){
        const seq = new SequenceInfo.module();
        sequences.push(seq);

        let field;
        while( (field = fread_int1(is)) != END_OF_FIELDS){
            let field_len;
            switch(field) {
                case FIELD_SEQUENCE_DESCRIPTION:
                    seq.setDescription(fread_str(is));
                    break;
                case FIELD_SEQUENCE_TYPE:
                    seq.setType(sequenceType[fread_int1(is)]);
                    break;
                case FIELD_SEQUENCE_SIZE:
                    seq.setSize(fread_int4(is));
                    break;
                case FIELD_SEQUENCE_HASH:
                    // TODO
                    seq.setHash(fread_str(is));
                    break;
                case FIELD_SEQUENCE_DATA_PLAIN:
                    field_len = fread_int4(is);
                    seq.setData(fread_array(field_len, is));
                    break;
                case FIELD_SEQUENCE_DATA_COMPRESSED:
                    field_len = fread_int4(is);
                    fread_dummy(field_len, is);
                    break;
                default:
                    throw `Sanity Check: Unknown Field (${field}).\n`;
            }
        }
    }

    return sequences;
}

function fread_alignment_params(sequences, is) {
    const params = new AlignmentParams.module();
    let field;
    
    while((field = fread_int1(is)) !== END_OF_FIELDS){
        switch(field){
            case FIELD_ALIGNMENT_METHOD:
                params.setAlignmentMethod(alignmentMethod[fread_int1(is)]);
                break;
            case FIELD_SCORING_SYSTEM:
                params.setScoreSystem(scoreSystem[fread_int1(is)]);
                switch(params.getScoreSystem()){
                    case scoreSystem[SCORE_MATCH_MISMATCH]:
                        const match = fread_int4(is);
                        const mismatch = fread_int4(is);
                        params.setMatchMismatchScores(match, mismatch);
                        break;
                    case scoreSystem[SCORE_SIMILARITY_MATRIX]:
                        throw 'Score Matrix not supported yet.\n';
                    default:
                        throw 'Unknown Score System.\n';
                }
                break;
            case FIELD_PENALTY_SYSTEM:
                let gapOpen;
                let gapExtension;
                params.setPenaltySystem(penaltySystem[fread_int1(is)]);
                switch(params.getPenaltySystem()){
                    case penaltySystem[PENALTY_LINEAR_GAP]:
                        gapOpen = 0;
                        gapExtension = fread_int4(is);
                        params.setAffineGapPenalties(gapOpen, gapExtension)             // Mistake?
                        break;
                    case penaltySystem[PENALTY_AFFINE_GAP]:
                        gapOpen = fread_int4(is);
                        gapExtension = fread_int4(is);
                        params.setAffineGapPenalties(gapOpen, gapExtension);
                        break;
                    default:
                        throw 'Unknown Penalty System.\n';
                }
                break;
            case FIELD_SEQUENCE_PARAMS:
                const count = fread_int4(is);
                
                for(let i = 0; i < count; i++){
                    let id = fread_int4(is);

                    let flags = fread_int4(is);
                    let trimStart = fread_int4(is);
                    let trimEnd = fread_int4(is);

                    let modifiers = new SequenceModifiers.module();
                    modifiers.setFlags(flags);
                    modifiers.setTrimPositions(trimStart, trimEnd);

                    params.addSequence(new Sequence.module(sequences[id], modifiers));
                }
                break;
            default:
                throw `Sanity Check: Unknown Field ${field}.\n`;
        }
    }

    return params;
}

function fread_alignment_result(alignment, is) {
    const results = fread_int4(is);
    
    if(results > 1)
        throw `Too many results: ${results}.\n`;

    let count = alignment.getAlignmentParams().getSequencesCount();
    let field;

    while((field = fread_int1(is)) !== END_OF_FIELDS){
        switch(field){
            case FIELD_RESULT_RAW_SCORE:
                alignment.setRawScore(fread_int4(is));
                break;
            case FIELD_RESULT_SCORE_STATISTICS:
                alignment.setMatches(fread_int4(is));
                alignment.setMismatches(fread_int4(is));
                alignment.setGapOpen(fread_int4(is));
                alignment.setGapExtensions(fread_int4(is));
                break;
            case FIELD_RESULT_GAP_LIST:
                for(let i = 0; i < count; i++){
                    let start = fread_int4(is);
                    let end = fread_int4(is);
                    alignment.setBoundaryPositions(i, start, end);
                    alignment.setGaps(i, fread_gaps(is));
                }
                break;
            case FIELD_RESULT_BLOCKS:
                let h = fread_int4(is);
                let w = fread_int4(is);

                let blocks = new Array(h);
                for(let i = 0; i < h; i++){ blocks[i] = new Array(w); }

                for(let i = 0; i < h; i++){
                    for(let j = 0; j < w; j++){
                        blocks[i][j] = fread_int4(is);
                    }
                }

                alignment.setBlocks(blocks);
                break;
            default:
                throw `Sanity Check: Unknown field ${field}.\n`;
        }   
    }
}

function fread_array(len, is) {
    byte += len;
    const data = [...is.slice(0, len)];
    return data.map(x => String.fromCharCode(x)).join('');
}

function fread_uint4_compressed(is) {
    // TODO next...
    let b = fread_int1(is);
    let i = (b & 0x7F);
    while(b >= 128) {
        b = fread_int1(is);
        i <<= 7;
        i |= (b & 0x7F);
    }

    return i;
}

function fread_int4(is) {
    return is.slice(byte, byte+=4).readIntBE(0, 4);
}

function fread_int2(is) {
    //
}

function fread_int1(is) {
    return is.slice(byte, ++byte).readUIntBE(0, 1);
}

function fread_str(is) {
    const len = fread_int4(is);

    if(len > MAX_STRING_LEN) 
        throw `Sanity Check: string is too large during file read (${len}) > ${MAX_STRING_LEN}`;

    const data = [...is.slice(byte, byte+=len)].map(char => {
        if(char === undefined) throw 'EOF while reading string';
        return String.fromCharCode(char);
    }).join('');
    
    return data;
}

function fread_gaps(is) {
    let count = fread_int4(is);
    let gaps = new GapList.module(0);

    let last = 0;
    for(let i = 0; i < count; i++){
        let pos = last + fread_uint4_compressed(is);
        last = pos;
        let len = fread_uint4_compressed(is);
        let gap = new Gap.module(pos, len);
        gaps.push(gap);
    }

    return gaps;
}

function fread_dummy(len, is) {
    byte += len;
}

// Makes it public
exports.module = {
    ALIGNMENT_METHOD_GLOBAL,
    ALIGNMENT_METHOD_LOCAL,
    PENALTY_LINEAR_GAP,
    PENALTY_AFFINE_GAP,
    SCORE_MATCH_MISMATCH,
    SCORE_SIMILARITY_MATRIX,
    read,
}

read();