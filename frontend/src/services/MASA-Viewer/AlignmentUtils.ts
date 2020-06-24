export default class AlignmentUtils {
  static formatSequenceSize = (length: number): string => {
    if (length < 1000) return `${length} BP`;
    if (length < 1000000) return `${length / 1000} KBP`;
    if (length < 1000000000) return `${length / 1000000} MBP`;
    return `${length / 1000000000} GBP`;
  };
}
