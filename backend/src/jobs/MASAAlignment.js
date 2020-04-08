const exec = require('child_process').execSync;

module.exports = {
    key: 'MASAAlignment',
    async handle({ data }) {
        const { 
            masa,
            s0edge,
            s1edge,
            clearn,
            complement,
            reverse,
            blockPruning,
            filesPath,
            s0,
            s1,
            results,
            s0folder,
            s1folder
        } = data;

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

        await exec(`
            ${masa} --alignment-edges=${s0edge}${s1edge} ${exeClearn}${exeComplement}${exeReverse}${exeBlockPruning} ${filesPath}/${s0} ${filesPath}/${s1} -d ${results}/${s0folder}-${s1folder} -1 > /dev/null 2>&1 &&
            ${masa} --alignment-edges=${s0edge}${s1edge} ${exeClearn}${exeComplement}${exeReverse}${exeBlockPruning} ${filesPath}/${s0} ${filesPath}/${s1} -d ${results}/${s0folder}-${s1folder} -2 > /dev/null 2>&1 &&
            ${masa} --alignment-edges=${s0edge}${s1edge} ${exeClearn}${exeComplement}${exeReverse}${exeBlockPruning} ${filesPath}/${s0} ${filesPath}/${s1} -d ${results}/${s0folder}-${s1folder} -3 > /dev/null 2>&1 &&
            ${masa} --alignment-edges=${s0edge}${s1edge} ${exeClearn}${exeComplement}${exeReverse}${exeBlockPruning} ${filesPath}/${s0} ${filesPath}/${s1} -d ${results}/${s0folder}-${s1folder} -4 > /dev/null 2>&1 &&
            ${masa} --alignment-edges=${s0edge}${s1edge} ${exeClearn}${exeComplement}${exeReverse}${exeBlockPruning} ${filesPath}/${s0} ${filesPath}/${s1} -d ${results}/${s0folder}-${s1folder} -5 > /dev/null 2>&1
        `);
    }
}