import path from 'path';
import fs from 'fs';

interface SelectMASAExtensionServiceDTO {
  extension: number;
  filesPath: string;
  s0: string;
  s1: string;
}

export default class SelectMASAExtensionService {
  execute({
    extension,
    filesPath,
    s0,
    s1,
  }: SelectMASAExtensionServiceDTO): string {
    let masa;

    if (extension === 1) masa = 'cudalign';
    else if (extension === 2) masa = 'masa-openmp';
    else {
      const { size: s0size } = fs.statSync(path.join(filesPath, s0));

      const { size: s1size } = fs.statSync(path.join(filesPath, s1));

      if (s0size <= 1000000 && s1size <= 1000000) {
        masa = 'masa-openmp';
      } else {
        masa = 'cudalign';
      }
    }

    return masa;
  }
}
