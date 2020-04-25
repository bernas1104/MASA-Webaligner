class GetBestInformationService {
    execute({ fileData }) {
        fileData.splice(0, 11);
        fileData.splice(2, fileData.length);

        const bestScore = Number(fileData[0].match(/[0-9]+/g).join(''));
        const bestPosition = fileData[1].match(/[0-9]+/g).map(position => Number(position));

        return { bestScore, bestPosition };
    }
}

module.exports = GetBestInformationService;
