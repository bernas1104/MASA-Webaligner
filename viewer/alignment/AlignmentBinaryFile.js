'use strict';

const fs = require('fs');

const Sequence = require('./Sequence');
const SequenceInfo = require('./SequenceInfo');
const SequenceModifiers = require('./SequenceModifiers');

const Alignment = require('./Alignment');
const AlignmentParams = require('./AlignmentParams');

const Gap = require('./Gap');
const GapList = require('./GapList');

class AlignmentBinaryFile {
    static getKeyByValue = (obj, value) => (
        Object.keys(obj).find(key => obj[key] === value)
    );

    static byte = 0;

    static MAX_STRING_LEN     = 1000

    static MAGIC_HEADER       = 'CGFF';
    static MAGIC_HEDAER_LEN   = 4;       // in Bytes
    static FILE_VERSION_MAJOR = 0;
    static FILE_VERSION_MINOR = 1;

    static END_OF_FIELDS = 0;

    static FIELD_ALIGNMENT_METHOD = 1;
    static FIELD_SCORING_SYSTEM   = 2;
    static FIELD_PENALTY_SYSTEM   = 3;
    static FIELD_SEQUENCE_PARAMS  = 4;

    static FIELD_SEQUENCE_DESCRIPTION     = 1;
    static FIELD_SEQUENCE_TYPE            = 2;
    static FIELD_SEQUENCE_SIZE            = 3;
    static FIELD_SEQUENCE_HASH            = 4;
    static FIELD_SEQUENCE_DATA_PLAIN      = 5;
    static FIELD_SEQUENCE_DATA_COMPRESSED = 6;

    static FIELD_RESULT_RAW_SCORE        = 1;
    static FIELD_RESULT_BIT_SCORE        = 2;
    static FIELD_RESULT_E_VALUE          = 3;
    static FIELD_RESULT_SCORE_STATISTICS = 4;
    static FIELD_RESULT_GAP_LIST         = 5;
    static FIELD_RESULT_BLOCKS           = 6;
    static FIELD_RESULT_CELLS            = 7;

    static SEQUENCE_TYPE_DNA     = 1;
    static SEQUENCE_TYPE_RNA     = 2;
    static SEQUENCE_TYPE_PROTEIN = 3;
    static SEQUENCE_TYPE_UNKNOWN = 255;
    static sequenceType = {
        [this.SEQUENCE_TYPE_DNA]: this.getKeyByValue(SequenceInfo.module.SequenceType, this.SEQUENCE_TYPE_DNA),
        [this.SEQUENCE_TYPE_RNA]: this.getKeyByValue(SequenceInfo.module.SequenceType, this.SEQUENCE_TYPE_RNA),
        [this.SEQUENCE_TYPE_PROTEIN]: this.getKeyByValue(SequenceInfo.module.SequenceType, this.SEQUENCE_TYPE_PROTEIN),
        [this.SEQUENCE_TYPE_UNKNOWN]: this.getKeyByValue(SequenceInfo.module.SequenceType, this.SEQUENCE_TYPE_UNKNOWN)
    };

    static ALIGNMENT_METHOD_GLOBAL = 1;
    static ALIGNMENT_METHOD_LOCAL  = 2;
    static alignmentMethod = {
        [this.ALIGNMENT_METHOD_GLOBAL]: this.getKeyByValue(AlignmentParams.module.AlignmentMethod, this.ALIGNMENT_METHOD_GLOBAL),
        [this.ALIGNMENT_METHOD_LOCAL]: this.getKeyByValue(AlignmentParams.module.AlignmentMethod, this.ALIGNMENT_METHOD_LOCAL)
    }

    static PENALTY_LINEAR_GAP = 1;
    static PENALTY_AFFINE_GAP = 2;
    static penaltySystem = {
        [this.PENALTY_AFFINE_GAP]: this.getKeyByValue(AlignmentParams.module.PenaltySystem, this.PENALTY_AFFINE_GAP),
        [this.PENALTY_LINEAR_GAP]: this.getKeyByValue(AlignmentParams.module.PenaltySystem, this.PENALTY_LINEAR_GAP)
    }

    static SCORE_MATCH_MISMATCH = 1;
    static SCORE_SIMILARITY_MATRIX = 2;
    static scoreSystem = {
        [this.SCORE_MATCH_MISMATCH]: this.getKeyByValue(AlignmentParams.module.ScoreSystem, this.SCORE_MATCH_MISMATCH),
        [this.SCORE_SIMILARITY_MATRIX]: this.getKeyByValue(AlignmentParams.module.ScoreSystem, this.SCORE_SIMILARITY_MATRIX)
    }

    static read = (file) => {
        const ds = fs.readFileSync(file);
        
        this.fread_header(ds);

        const sequences = this.fread_sequences(ds);

        const params = this.fread_alignment_params(sequences, ds);
        const alignment = new Alignment.module(params);
        this.fread_alignment_result(alignment, ds);

        return alignment;
    }

    static fread_header = (is) => {
        const header = this.fread_array(this.MAGIC_HEDAER_LEN, is);
        
        if(header !== this.MAGIC_HEADER) throw 'Wrong File Format. Header Error.\n';

        const file_version_major = this.fread_int1(is);
        const file_version_minor = this.fread_int1(is);
        if(file_version_major > this.FILE_VERSION_MAJOR) 
            throw `File Version not supported (${file_version_major}.${file_version_minor} > ${this.FILE_VERSION_MAJOR}.${this.FILE_VERSION_MINOR})`;
    }

    static fread_sequences = (is) => {
        const count = this.fread_int4(is);
        let sequences = []
        
        for(let i = 0; i < count; i++){
            const seq = new SequenceInfo.module();
            sequences.push(seq);

            let field;
            while( (field = this.fread_int1(is)) != this.END_OF_FIELDS){
                let field_len;
                switch(field) {
                    case this.FIELD_SEQUENCE_DESCRIPTION:
                        seq.setDescription(this.fread_str(is));
                        break;
                    case this.FIELD_SEQUENCE_TYPE:
                        seq.setType(this.sequenceType[this.fread_int1(is)]);
                        break;
                    case this.FIELD_SEQUENCE_SIZE:
                        seq.setSize(this.fread_int4(is));
                        break;
                    case this.FIELD_SEQUENCE_HASH:
                        // TODO
                        seq.setHash(this.fread_str(is));
                        break;
                    case this.FIELD_SEQUENCE_DATA_PLAIN:
                        field_len = this.fread_int4(is);
                        seq.setData(this.fread_array(field_len, is));
                        break;
                    case this.FIELD_SEQUENCE_DATA_COMPRESSED:
                        field_len = this.fread_int4(is);
                        this.fread_dummy(field_len, is);
                        break;
                    default:
                        throw `Sanity Check: Unknown Field (${field}).\n`;
                }
            }
        }

        return sequences;
    }

    static fread_alignment_params = (sequences, is) => {
        const params = new AlignmentParams.module();
        let field;
        
        while((field = this.fread_int1(is)) !== this.END_OF_FIELDS){
            switch(field){
                case this.FIELD_ALIGNMENT_METHOD:
                    params.setAlignmentMethod(this.alignmentMethod[this.fread_int1(is)]);
                    break;
                case this.FIELD_SCORING_SYSTEM:
                    params.setScoreSystem(this.scoreSystem[this.fread_int1(is)]);
                    switch(params.getScoreSystem()){
                        case this.scoreSystem[this.SCORE_MATCH_MISMATCH]:
                            const match = this.fread_int4(is);
                            const mismatch = this.fread_int4(is);
                            params.setMatchMismatchScores(match, mismatch);
                            break;
                        case this.scoreSystem[this.SCORE_SIMILARITY_MATRIX]:
                            throw 'Score Matrix not supported yet.\n';
                        default:
                            throw 'Unknown Score System.\n';
                    }
                    break;
                case this.FIELD_PENALTY_SYSTEM:
                    let gapOpen;
                    let gapExtension;
                    params.setPenaltySystem(this.penaltySystem[this.fread_int1(is)]);
                    switch(params.getPenaltySystem()){
                        case this.penaltySystem[this.PENALTY_LINEAR_GAP]:
                            gapOpen = 0;
                            gapExtension = fread_int4(is);
                            params.setAffineGapPenalties(gapOpen, gapExtension)             // Mistake?
                            break;
                        case this.penaltySystem[this.PENALTY_AFFINE_GAP]:
                            gapOpen = this.fread_int4(is);
                            gapExtension = this.fread_int4(is);
                            params.setAffineGapPenalties(gapOpen, gapExtension);
                            break;
                        default:
                            throw 'Unknown Penalty System.\n';
                    }
                    break;
                case this.FIELD_SEQUENCE_PARAMS:
                    const count = this.fread_int4(is);
                    
                    for(let i = 0; i < count; i++){
                        let id = this.fread_int4(is);

                        let flags = this.fread_int4(is);
                        let trimStart = this.fread_int4(is);
                        let trimEnd = this.fread_int4(is);

                        let modifiers = new SequenceModifiers.module();
                        modifiers.setFlags(flags);
                        modifiers.setTrimPositions(trimStart, trimEnd);

                        console.log(new Sequence.module(sequences[id], modifiers).getInfo().getDescription());
                        params.addSequence(new Sequence.module(sequences[id], modifiers));
                    }
                    break;
                default:
                    throw `Sanity Check: Unknown Field ${field}.\n`;
            }
        }

        return params;
    }

    static fread_alignment_result = (alignment, is) => {
        const results = this.fread_int4(is);
        
        if(results > 1)
            throw `Too many results: ${results}.\n`;

        let count = alignment.getAlignmentParams().getSequencesCount();
        let field;

        while((field = this.fread_int1(is)) !== this.END_OF_FIELDS){
            switch(field){
                case this.FIELD_RESULT_RAW_SCORE:
                    alignment.setRawScore(this.fread_int4(is));
                    break;
                case this.FIELD_RESULT_SCORE_STATISTICS:
                    alignment.setMatches(this.fread_int4(is));
                    alignment.setMismatches(this.fread_int4(is));
                    alignment.setGapOpen(this.fread_int4(is));
                    alignment.setGapExtensions(this.fread_int4(is));
                    break;
                case this.FIELD_RESULT_GAP_LIST:
                    for(let i = 0; i < count; i++){
                        let start = this.fread_int4(is);
                        let end = this.fread_int4(is);
                        alignment.setBoundaryPositions(i, start, end);
                        alignment.setGaps(i, this.fread_gaps(is));
                    }
                    break;
                case this.FIELD_RESULT_BLOCKS:
                    let h = this.fread_int4(is);
                    let w = this.fread_int4(is);

                    let blocks = new Array(h);
                    for(let i = 0; i < h; i++){ blocks[i] = new Array(w); }

                    for(let i = 0; i < h; i++){
                        for(let j = 0; j < w; j++){
                            blocks[i][j] = this.fread_int4(is);
                        }
                    }

                    alignment.setBlocks(blocks);
                    break;
                default:
                    throw `Sanity Check: Unknown field ${field}.\n`;
            }   
        }
    }

    static fread_array = (len, is) => {
        this.byte += len;
        const data = [...is.slice(0, len)];
        return data.map(x => String.fromCharCode(x)).join('');
    }

    static fread_uint4_compressed = (is) => {
        let b = this.fread_int1(is);
        let i = (b & 0x7F);
        while(b >= 128) {
            b = this.fread_int1(is);
            i <<= 7;
            i |= (b & 0x7F);
        }

        return i;
    }

    static fread_int4 = (is) => {
        return is.slice(this.byte, this.byte+=4).readIntBE(0, 4);
    }

    static fread_int2 = (is) => {
        // TODO
    }

    static fread_int1 = (is) => {
        return is.slice(this.byte, ++this.byte).readUIntBE(0, 1);
    }

    static fread_str = (is) => {
        const len = this.fread_int4(is);

        if(len > this.MAX_STRING_LEN) 
            throw `Sanity Check: string is too large during file read (${len}) > ${this.MAX_STRING_LEN}`;

        const data = [...is.slice(this.byte, this.byte+=len)].map(char => {
            if(char === undefined) throw 'EOF while reading string';
            return String.fromCharCode(char);
        }).join('');
        
        return data;
    }

    static fread_gaps = (is) => {
        let count = this.fread_int4(is);
        let gaps = new GapList.module(0);

        let last = 0;
        for(let i = 0; i < count; i++){
            let pos = last + this.fread_uint4_compressed(is);
            last = pos;
            let len = this.fread_uint4_compressed(is);
            let gap = new Gap.module(pos, len);
            gaps.push(gap);
        }

        return gaps;
    }

    static fread_dummy = (len, is) => {
        this.byte += len;
    }

}

exports.module = AlignmentBinaryFile