const exec = require('child_process').execSync;

module.exports = {
    key: 'MASAAlignment',
    async handle({ data }) {
        const { masa, s0edge, s1edge, filesPath, s0, s1,
            results, s0folder, s1folder } = data;

        
        await exec(`
            ${masa} --alignment-edges=${s0edge}${s1edge} ${filesPath}/${s0} ${filesPath}/${s1} -d ${results}/${s0folder}-${s1folder} -1 &&
            ${masa} --alignment-edges=${s0edge}${s1edge} ${filesPath}/${s0} ${filesPath}/${s1} -d ${results}/${s0folder}-${s1folder} -2 &&
            ${masa} --alignment-edges=${s0edge}${s1edge} ${filesPath}/${s0} ${filesPath}/${s1} -d ${results}/${s0folder}-${s1folder} -3 &&
            ${masa} --alignment-edges=${s0edge}${s1edge} ${filesPath}/${s0} ${filesPath}/${s1} -d ${results}/${s0folder}-${s1folder} -4 &&
            ${masa} --alignment-edges=${s0edge}${s1edge} ${filesPath}/${s0} ${filesPath}/${s1} -d ${results}/${s0folder}-${s1folder} -5
        `);
    }
}