import fs from 'fs';
import path from 'path';
import { injectable } from 'tsyringe';

import uploadConfig from '@config/upload';

interface IRequest {
  extension: number;
  s0: string;
  s1: string;
}

@injectable()
export default class SelectMASAExtensionService {
  execute({ extension, s0, s1 }: IRequest): string {
    let masa;

    if (extension === 1) masa = 'cudalign';
    else if (extension === 2) masa = 'masa-openmp';
    else {
      const { size: s0size } = fs.statSync(
        path.resolve(uploadConfig.uploadsFolder, s0),
      );

      const { size: s1size } = fs.statSync(
        path.resolve(uploadConfig.uploadsFolder, s1),
      );

      if (s0size <= 1000000 && s1size <= 1000000) {
        masa = 'masa-openmp';
      } else {
        masa = 'cudalign';
      }
    }

    return masa;
  }
}
