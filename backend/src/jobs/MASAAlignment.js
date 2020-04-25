const exec = require('child_process').execSync;

module.exports = {
    key: 'MASAAlignment',
    async handle({ data }) {
        const { masa, only1, clearn, complement, reverse, blockPruning, s0, s1,
            s0edge, s1edge, s0folder, s1folder, filesPath, resultsPath } = data;

        let exeClearn = '';
        if(clearn)
            exeClearn = '--clear-n ';

        let exeComplement = '';
        if(complement)
            exeComplement = `--complement=${complement < 3 ? String(complement) : 'both'} `;

        let exeReverse = '';
        if(reverse)
            exeReverse = `--reverse=${reverse < 3 ? String(reverse) : 'both'} `;

        let exeBlockPruning = '';
        if(blockPruning === false)
            exeBlockPruning = '--no-block-pruning';

        if(!only1){
            await exec(`
                ${masa} --alignment-edges=${s0edge}${s1edge} ${exeClearn}${exeComplement}${exeReverse}${exeBlockPruning} ${filesPath}/${s0} ${filesPath}/${s1} -d ${resultsPath}/${s0folder}-${s1folder} -1 > /dev/null 2>&1 &&
                ${masa} --alignment-edges=${s0edge}${s1edge} ${exeClearn}${exeComplement}${exeReverse}${exeBlockPruning} ${filesPath}/${s0} ${filesPath}/${s1} -d ${resultsPath}/${s0folder}-${s1folder} -2 > /dev/null 2>&1 &&
                ${masa} --alignment-edges=${s0edge}${s1edge} ${exeClearn}${exeComplement}${exeReverse}${exeBlockPruning} ${filesPath}/${s0} ${filesPath}/${s1} -d ${resultsPath}/${s0folder}-${s1folder} -3 > /dev/null 2>&1 &&
                ${masa} --alignment-edges=${s0edge}${s1edge} ${exeClearn}${exeComplement}${exeReverse}${exeBlockPruning} ${filesPath}/${s0} ${filesPath}/${s1} -d ${resultsPath}/${s0folder}-${s1folder} -4 > /dev/null 2>&1 &&
                ${masa} --alignment-edges=${s0edge}${s1edge} ${exeClearn}${exeComplement}${exeReverse}${exeBlockPruning} ${filesPath}/${s0} ${filesPath}/${s1} -d ${resultsPath}/${s0folder}-${s1folder} -5 > /dev/null 2>&1
            `);
        } else {
            await exec(`
                ${masa} --alignment-edges=${s0edge}${s1edge} ${exeClearn}${exeComplement}${exeReverse}${exeBlockPruning} ${filesPath}/${s0} ${filesPath}/${s1} -d ${resultsPath}/${s0folder}-${s1folder} -1 > /dev/null 2>&1
            `);
        }
    }
}
