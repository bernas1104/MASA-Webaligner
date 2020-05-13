import Sequence from './Sequence';
import SequenceInfo from './SequenceInfo';
import SequenceModifiers from './SequenceModifiers';

import Alignment from './Alignment';
import AlignmentParams from './AlignmentParams';

import Gap from './Gap';
import GapList from './GapList';

interface Props {
  [key: string]: number;
}

export default class AlignmentBinaryFile {
  static getKeyByValue = (obj: Props, value: number): string =>
    Object.keys(obj).find((key) => obj[key] === value)!;

  static byte = 0;

  static MAX_STRING_LEN = 1000;

  static MAGIC_HEADER = 'CGFF';

  static MAGIC_HEDAER_LEN = 4; // in Bytes

  static FILE_VERSION_MAJOR = 0;

  static FILE_VERSION_MINOR = 1;

  static END_OF_FIELDS = 0;

  static FIELD_ALIGNMENT_METHOD = 1;

  static FIELD_SCORING_SYSTEM = 2;

  static FIELD_PENALTY_SYSTEM = 3;

  static FIELD_SEQUENCE_PARAMS = 4;

  static FIELD_SEQUENCE_DESCRIPTION = 1;

  static FIELD_SEQUENCE_TYPE = 2;

  static FIELD_SEQUENCE_SIZE = 3;

  static FIELD_SEQUENCE_HASH = 4;

  static FIELD_SEQUENCE_DATA_PLAIN = 5;

  static FIELD_SEQUENCE_DATA_COMPRESSED = 6;

  static FIELD_RESULT_RAW_SCORE = 1;

  static FIELD_RESULT_BIT_SCORE = 2;

  static FIELD_RESULT_E_VALUE = 3;

  static FIELD_RESULT_SCORE_STATISTICS = 4;

  static FIELD_RESULT_GAP_LIST = 5;

  static FIELD_RESULT_BLOCKS = 6;

  static FIELD_RESULT_CELLS = 7;

  static SEQUENCE_TYPE_DNA = 1;

  static SEQUENCE_TYPE_RNA = 2;

  static SEQUENCE_TYPE_PROTEIN = 3;

  static SEQUENCE_TYPE_UNKNOWN = 255;

  static sequenceType = {
    [AlignmentBinaryFile.SEQUENCE_TYPE_DNA]: AlignmentBinaryFile.getKeyByValue(
      SequenceInfo.SequenceType,
      AlignmentBinaryFile.SEQUENCE_TYPE_DNA,
    ),
    [AlignmentBinaryFile.SEQUENCE_TYPE_RNA]: AlignmentBinaryFile.getKeyByValue(
      SequenceInfo.SequenceType,
      AlignmentBinaryFile.SEQUENCE_TYPE_RNA,
    ),
    [AlignmentBinaryFile.SEQUENCE_TYPE_PROTEIN]: AlignmentBinaryFile.getKeyByValue(
      SequenceInfo.SequenceType,
      AlignmentBinaryFile.SEQUENCE_TYPE_PROTEIN,
    ),
    [AlignmentBinaryFile.SEQUENCE_TYPE_UNKNOWN]: AlignmentBinaryFile.getKeyByValue(
      SequenceInfo.SequenceType,
      AlignmentBinaryFile.SEQUENCE_TYPE_UNKNOWN,
    ),
  };

  static ALIGNMENT_METHOD_GLOBAL = 1;

  static ALIGNMENT_METHOD_LOCAL = 2;

  static alignmentMethod = {
    [AlignmentBinaryFile.ALIGNMENT_METHOD_GLOBAL]: AlignmentBinaryFile.getKeyByValue(
      AlignmentParams.AlignmentMethod,
      AlignmentBinaryFile.ALIGNMENT_METHOD_GLOBAL,
    ),
    [AlignmentBinaryFile.ALIGNMENT_METHOD_LOCAL]: AlignmentBinaryFile.getKeyByValue(
      AlignmentParams.AlignmentMethod,
      AlignmentBinaryFile.ALIGNMENT_METHOD_LOCAL,
    ),
  };

  static PENALTY_LINEAR_GAP = 1;

  static PENALTY_AFFINE_GAP = 2;

  static penaltySystem = {
    [AlignmentBinaryFile.PENALTY_AFFINE_GAP]: AlignmentBinaryFile.getKeyByValue(
      AlignmentParams.PenaltySystem,
      AlignmentBinaryFile.PENALTY_AFFINE_GAP,
    ),
    [AlignmentBinaryFile.PENALTY_LINEAR_GAP]: AlignmentBinaryFile.getKeyByValue(
      AlignmentParams.PenaltySystem,
      AlignmentBinaryFile.PENALTY_LINEAR_GAP,
    ),
  };

  static SCORE_MATCH_MISMATCH = 1;

  static SCORE_SIMILARITY_MATRIX = 2;

  static scoreSystem = {
    [AlignmentBinaryFile.SCORE_MATCH_MISMATCH]: AlignmentBinaryFile.getKeyByValue(
      AlignmentParams.ScoreSystem,
      AlignmentBinaryFile.SCORE_MATCH_MISMATCH,
    ),
    [AlignmentBinaryFile.SCORE_SIMILARITY_MATRIX]: AlignmentBinaryFile.getKeyByValue(
      AlignmentParams.ScoreSystem,
      AlignmentBinaryFile.SCORE_SIMILARITY_MATRIX,
    ),
  };

  static read = (file: Buffer): Alignment => {
    const ds = file;

    AlignmentBinaryFile.fread_header(ds);

    const sequences = AlignmentBinaryFile.fread_sequences(ds);

    const params = AlignmentBinaryFile.fread_alignment_params(sequences, ds);

    const alignment = new Alignment(params);
    AlignmentBinaryFile.fread_alignment_result(alignment, ds);

    return alignment;
  };

  static fread_header = (is: Buffer): void => {
    const header = AlignmentBinaryFile.fread_array(
      AlignmentBinaryFile.MAGIC_HEDAER_LEN,
      is,
    );

    if (header !== AlignmentBinaryFile.MAGIC_HEADER)
      throw new Error('Wrong File Format. Header Error.\n');

    const file_version_major = AlignmentBinaryFile.fread_int1(is);
    const file_version_minor = AlignmentBinaryFile.fread_int1(is);
    if (file_version_major > AlignmentBinaryFile.FILE_VERSION_MAJOR)
      throw new Error(
        `File Version not supported (${file_version_major}.${file_version_minor} > ${AlignmentBinaryFile.FILE_VERSION_MAJOR}.${AlignmentBinaryFile.FILE_VERSION_MINOR})`,
      );
  };

  static fread_sequences = (is: Buffer): SequenceInfo[] => {
    const count = AlignmentBinaryFile.fread_int4(is);
    const sequences: SequenceInfo[] = [];

    for (let i = 0; i < count; i += 1) {
      const seq = new SequenceInfo();
      sequences.push(seq);

      let field;
      while (
        (field = AlignmentBinaryFile.fread_int1(is)) !==
        AlignmentBinaryFile.END_OF_FIELDS
      ) {
        let field_len;
        switch (field) {
          case AlignmentBinaryFile.FIELD_SEQUENCE_DESCRIPTION:
            seq.setDescription(AlignmentBinaryFile.fread_str(is));
            break;
          case AlignmentBinaryFile.FIELD_SEQUENCE_TYPE:
            seq.setType(
              AlignmentBinaryFile.sequenceType[
                AlignmentBinaryFile.fread_int1(is)
              ]!,
            );
            break;
          case AlignmentBinaryFile.FIELD_SEQUENCE_SIZE:
            seq.setSize(AlignmentBinaryFile.fread_int4(is));
            break;
          case AlignmentBinaryFile.FIELD_SEQUENCE_HASH:
            // TODO
            seq.setHash(AlignmentBinaryFile.fread_str(is));
            break;
          case AlignmentBinaryFile.FIELD_SEQUENCE_DATA_PLAIN:
            field_len = AlignmentBinaryFile.fread_int4(is);
            seq.setData(AlignmentBinaryFile.fread_array(field_len, is));
            break;
          case AlignmentBinaryFile.FIELD_SEQUENCE_DATA_COMPRESSED:
            field_len = AlignmentBinaryFile.fread_int4(is);
            AlignmentBinaryFile.fread_dummy(field_len, is);
            break;
          default:
            throw new Error(`Sanity Check: Unknown Field (${field}).\n`);
        }
      }
    }

    return sequences;
  };

  static fread_alignment_params = (
    sequences: SequenceInfo[],
    is: Buffer,
  ): AlignmentParams => {
    const params = new AlignmentParams();
    let field;

    while (
      (field = AlignmentBinaryFile.fread_int1(is)) !==
      AlignmentBinaryFile.END_OF_FIELDS
    ) {
      switch (field) {
        case AlignmentBinaryFile.FIELD_ALIGNMENT_METHOD:
          params.setAlignmentMethod(
            AlignmentBinaryFile.alignmentMethod[
              AlignmentBinaryFile.fread_int1(is)
            ]!,
          );
          break;
        case AlignmentBinaryFile.FIELD_SCORING_SYSTEM:
          params.setScoreSystem(
            AlignmentBinaryFile.scoreSystem[
              AlignmentBinaryFile.fread_int1(is)
            ]!,
          );
          switch (params.getScoreSystem()) {
            case AlignmentBinaryFile.scoreSystem[
              AlignmentBinaryFile.SCORE_MATCH_MISMATCH
            ]: {
              const match = AlignmentBinaryFile.fread_int4(is);
              const mismatch = AlignmentBinaryFile.fread_int4(is);
              params.setMatchMismatchScores(match, mismatch);
              break;
            }
            case AlignmentBinaryFile.scoreSystem[
              AlignmentBinaryFile.SCORE_SIMILARITY_MATRIX
            ]:
              throw new Error('Score Matrix not supported yet.\n');
            default:
              throw new Error('Unknown Score System.\n');
          }
          break;
        case AlignmentBinaryFile.FIELD_PENALTY_SYSTEM: {
          let gapOpen;
          let gapExtension;
          params.setPenaltySystem(
            AlignmentBinaryFile.penaltySystem[
              AlignmentBinaryFile.fread_int1(is)
            ]!,
          );
          switch (params.getPenaltySystem()) {
            case AlignmentBinaryFile.penaltySystem[
              AlignmentBinaryFile.PENALTY_LINEAR_GAP
            ]:
              gapOpen = 0;
              gapExtension = AlignmentBinaryFile.fread_int4(is);
              params.setAffineGapPenalties(gapOpen, gapExtension); // Mistake?
              break;
            case AlignmentBinaryFile.penaltySystem[
              AlignmentBinaryFile.PENALTY_AFFINE_GAP
            ]:
              gapOpen = AlignmentBinaryFile.fread_int4(is);
              gapExtension = AlignmentBinaryFile.fread_int4(is);
              params.setAffineGapPenalties(gapOpen, gapExtension);
              break;
            default:
              throw new Error('Unknown Penalty System.\n');
          }
          break;
        }
        case AlignmentBinaryFile.FIELD_SEQUENCE_PARAMS: {
          const count = AlignmentBinaryFile.fread_int4(is);

          for (let i = 0; i < count; i += 1) {
            const id = AlignmentBinaryFile.fread_int4(is);

            const flags = AlignmentBinaryFile.fread_int4(is);
            const trimStart = AlignmentBinaryFile.fread_int4(is);
            const trimEnd = AlignmentBinaryFile.fread_int4(is);

            const modifiers = new SequenceModifiers();
            modifiers.setFlags(flags);
            modifiers.setTrimPositions(trimStart, trimEnd);

            params.addSequence(new Sequence(sequences[id], modifiers));
          }
          break;
        }
        default:
          throw new Error(`Sanity Check: Unknown Field ${field}.\n`);
      }
    }

    return params;
  };

  static fread_alignment_result = (alignment: Alignment, is: Buffer): void => {
    const results = AlignmentBinaryFile.fread_int4(is);

    if (results > 1) throw new Error(`Too many results: ${results}.\n`);

    const count = alignment.getAlignmentParams().getSequencesCount();
    let field;

    while (
      (field = AlignmentBinaryFile.fread_int1(is)) !==
      AlignmentBinaryFile.END_OF_FIELDS
    ) {
      switch (field) {
        case AlignmentBinaryFile.FIELD_RESULT_RAW_SCORE:
          alignment.setRawScore(AlignmentBinaryFile.fread_int4(is));
          break;
        case AlignmentBinaryFile.FIELD_RESULT_SCORE_STATISTICS:
          alignment.setMatches(AlignmentBinaryFile.fread_int4(is));
          alignment.setMismatches(AlignmentBinaryFile.fread_int4(is));
          alignment.setGapOpen(AlignmentBinaryFile.fread_int4(is));
          alignment.setGapExtensions(AlignmentBinaryFile.fread_int4(is));
          break;
        case AlignmentBinaryFile.FIELD_RESULT_GAP_LIST:
          for (let i = 0; i < count; i += 1) {
            const start = AlignmentBinaryFile.fread_int4(is);
            const end = AlignmentBinaryFile.fread_int4(is);
            alignment.setBoundaryPositions(i, start, end);
            alignment.setGaps(i, AlignmentBinaryFile.fread_gaps(is));
          }
          break;
        case AlignmentBinaryFile.FIELD_RESULT_BLOCKS: {
          const h = AlignmentBinaryFile.fread_int4(is);
          const w = AlignmentBinaryFile.fread_int4(is);

          const blocks = new Array(h);
          for (let i = 0; i < h; i += 1) {
            blocks[i] = new Array(w);
          }

          for (let i = 0; i < h; i += 1) {
            for (let j = 0; j < w; j += 1) {
              blocks[i][j] = AlignmentBinaryFile.fread_int4(is);
            }
          }

          alignment.setBlocks(blocks);
          break;
        }
        default:
          throw new Error(`Sanity Check: Unknown field ${field}.\n`);
      }
    }
  };

  static fread_array = (len: number, is: Buffer): string => {
    const data = is.slice(
      AlignmentBinaryFile.byte,
      (AlignmentBinaryFile.byte += len),
    );

    return data.toString();
  };

  static fread_uint4_compressed = (is: Buffer): number => {
    let b = AlignmentBinaryFile.fread_int1(is);
    let i = b & 0x7f;
    while (b >= 128) {
      b = AlignmentBinaryFile.fread_int1(is);
      i <<= 7;
      i |= b & 0x7f;
    }

    return i;
  };

  static fread_int4 = (is: Buffer): number => {
    const nro = is
      .slice(AlignmentBinaryFile.byte, (AlignmentBinaryFile.byte += 4))
      .readIntBE(0, 4);
    return nro;
  };

  static fread_int2 = (is: Buffer): number => {
    const nro = is
      .slice(AlignmentBinaryFile.byte, (AlignmentBinaryFile.byte += 2))
      .readIntBE(0, 2);
    return nro;
  };

  static fread_int1 = (is: Buffer): number => {
    const nro = is
      .slice(AlignmentBinaryFile.byte, (AlignmentBinaryFile.byte += 1))
      .readUIntBE(0, 1);
    return nro;
  };

  static fread_str = (is: Buffer): string => {
    const len = AlignmentBinaryFile.fread_int4(is);

    if (len > AlignmentBinaryFile.MAX_STRING_LEN)
      throw new Error(
        `Sanity Check: string is too large during file read (${len}) > ${AlignmentBinaryFile.MAX_STRING_LEN}`,
      );

    const data = is
      .slice(AlignmentBinaryFile.byte, (AlignmentBinaryFile.byte += len))
      .toString();

    return data;
  };

  static fread_gaps = (is: Buffer): GapList => {
    const count = AlignmentBinaryFile.fread_int4(is);
    const gaps = new GapList(0);

    let last = 0;
    for (let i = 0; i < count; i += 1) {
      const pos = last + AlignmentBinaryFile.fread_uint4_compressed(is);
      last = pos;
      const len = AlignmentBinaryFile.fread_uint4_compressed(is);
      const gap = new Gap(pos, len);
      gaps.push(gap);
    }

    return gaps;
  };

  static fread_dummy = (len: number, _: Buffer): void => {
    AlignmentBinaryFile.byte += len;
  };
}
