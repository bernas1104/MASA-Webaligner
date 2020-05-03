import path from 'path';
import fs from 'fs';
import { getRepository } from 'typeorm';

import Sequence from '../models/Sequence';

require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

interface FetchStageIResultsServiceDTO {
  id: string;
}

interface StageIResults {
  bestScore: number;
  bestPosition: number[];
}

export default class FetchStageIResultsService {
  async execute({ id }: FetchStageIResultsServiceDTO): Promise<StageIResults> {
    const sequenceRepository = getRepository(Sequence);

    const [{ file: s0 }, { file: s1 }] = await sequenceRepository.find({
      where: { alignment_id: id },
    });
    const filePath =
      process.env.NODE_ENV !== 'test'
        ? path.resolve(
            __dirname,
            '..',
            '..',
            'results',
            `${path.parse(s0).name}-${path.parse(s1).name}`,
            'statistics_01.00',
          )
        : path.resolve(
            __dirname,
            '..',
            '..',
            '__tests__',
            'results',
            `${path.parse(s0).name}-${path.parse(s1).name}`,
            'statistics_01.00',
          );

    const fileData = fs.readFileSync(filePath, 'utf-8').split('\n');

    let gpu = false;
    fileData.forEach(line => {
      if (line.includes('GPU')) gpu = true;
    });

    if (!gpu) fileData.splice(0, 11);
    else fileData.splice(0, 15);

    fileData.splice(2, fileData.length);

    const bestScore = Number(fileData[0].match(/[0-9]+/g)!.join(''));
    const bestPosition = fileData[1]
      .match(/[0-9]+/g)!
      .map(position => Number(position));

    return { bestScore, bestPosition };
  }
}
