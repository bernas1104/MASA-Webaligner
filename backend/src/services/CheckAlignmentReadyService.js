const path = require('path');
const mz = require('mz/fs');

class CheckAlignmentReadyService {
    async execute({ s0, s1, only1 }){
        let isReady;
        let filePath = path.resolve(__dirname, '..', '..', 'results',
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
