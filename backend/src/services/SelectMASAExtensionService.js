const path = require('path');
const fs = require('fs');

class SelectMASAExtensionService {
    execute({ extension, filesPath, s0, s1 }){
        let masa;

        if(extension === 1)
                masa = 'cudalign';
        else if(extension === 2)
            masa = 'masa-openmp';
        else {
            var { size } = fs.statSync(path.join(filesPath, s0));
            const s0size = size;

            var { size } = fs.statSync(path.join(filesPath, s1));
            const s1size = size;

            if(s0size <= 1000000 && s1size <= 1000000) {
                masa = 'masa-openmp';
            } else {
                masa = 'cudalign';
            }
        }

        return masa;
    }
}

module.exports = SelectMASAExtensionService;
