const path = require('path');
const mz = require('mz/fs');
require('dotenv').config({
    path: process.env.NODE_ENV === 'test' ? ".env.test" : '.env'
});

class CheckAlignmentReadyService {
    async execute({ s0, s1, only1 }){
        let isReady;
        let filePath = process.env.NODE_ENV !== 'test' ?
            path.resolve(__dirname, '..', '..', 'results',
                path.parse(s0).name + '-' + path.parse(s1).name) :
            path.resolve(__dirname, '..', '..', '__tests__', 'results',
                path.parse(s0).name + '-' + path.parse(s1).name);

        if(!only1){
            filePath = path.join(filePath, 'alignment.00.bin');

            isReady = await mz.exists(filePath);
        } else {
            filePath = path.join(filePath, 'statistics_01.00');

            isReady = await mz.exists(filePath);
        }

        return isReady;
    }
}

module.exports = CheckAlignmentReadyService;
