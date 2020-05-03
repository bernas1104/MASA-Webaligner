import path from 'path';
import mz from 'mz/fs';

require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

export interface CheckAlignmentReadyServiceDTO {
  s0: string;
  s1: string;
  only1: boolean;
}

export default class CheckAlignmentReadyService {
  async execute({
    s0,
    s1,
    only1,
  }: CheckAlignmentReadyServiceDTO): Promise<boolean> {
    let filePath =
      process.env.NODE_ENV !== 'test'
        ? path.resolve(
            __dirname,
            '..',
            '..',
            'results',
            `${path.parse(s0).name}-${path.parse(s1).name}`,
          )
        : path.resolve(
            __dirname,
            '..',
            '..',
            '__tests__',
            'results',
            `${path.parse(s0).name}-${path.parse(s1).name}`,
          );

    if (!only1) filePath = path.resolve(filePath, 'alignment.00.bin');
    else filePath = path.resolve(filePath, 'statistics_01.00');

    const isReady = await mz.exists(filePath);

    return isReady;
  }
}
