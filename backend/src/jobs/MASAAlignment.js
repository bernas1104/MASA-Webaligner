const exec = require('child_process').execSync;

const Queue = require('./../lib/Queue');

module.exports = {
    key: 'MASAAlignment',
    async handle({ data }) {
        const { masa, s0edge, s1edge, filesPath, s0, s1,
            results, s0folder, s1folder, name, email, id } = data;

        await exec(`
            ${masa} --alignment-edges=${s0edge}${s1edge} ${filesPath}/${s0} ${filesPath}/${s1} -d ${results}/${s0folder}-${s1folder} -1 > /dev/null 2>&1 &&
            ${masa} --alignment-edges=${s0edge}${s1edge} ${filesPath}/${s0} ${filesPath}/${s1} -d ${results}/${s0folder}-${s1folder} -2 > /dev/null 2>&1 &&
            ${masa} --alignment-edges=${s0edge}${s1edge} ${filesPath}/${s0} ${filesPath}/${s1} -d ${results}/${s0folder}-${s1folder} -3 > /dev/null 2>&1 &&
            ${masa} --alignment-edges=${s0edge}${s1edge} ${filesPath}/${s0} ${filesPath}/${s1} -d ${results}/${s0folder}-${s1folder} -4 > /dev/null 2>&1 &&
            ${masa} --alignment-edges=${s0edge}${s1edge} ${filesPath}/${s0} ${filesPath}/${s1} -d ${results}/${s0folder}-${s1folder} -5 > /dev/null 2>&1
        `);
    }
}