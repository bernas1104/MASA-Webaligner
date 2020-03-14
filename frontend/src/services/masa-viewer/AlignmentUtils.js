export default class AlignmentUtils {
    static formatSequenceSize = (length) => {
        if(length < 1000)
            return `${length} BP`;
        else if (length < 1000000)
            return `${length/1000} KBP`
        else if (length < 1000000000)
            return `${length/1000000} MBP`;
        else
            return `${length/1000000000} GBP`;
    }
}