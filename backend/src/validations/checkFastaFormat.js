const path = require('path');
const { exec } = require('child_process');

module.exports = function checkFastaFormat(sequence){
    const verifier = /(>[A-Z]+_?[0-9]{5,6}\.[0-9]{1} (.*)\n)?([AGCTN]+[\n]?)/gy;
    return verifier.test(sequence);
}