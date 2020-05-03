import path from 'path';
import fs from 'fs';
import { uuid } from 'uuidv4';

require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

interface SaveInputToFileServiceDTO {
  text: string;
}

export default class SaveInputToFileService {
  execute({ text }: SaveInputToFileServiceDTO): string {
    const filePath =
      process.env.NODE_ENV !== 'test'
        ? path.resolve(__dirname, '..', '..', 'uploads', `${uuid()}.fasta`)
        : path.resolve(
            __dirname,
            '..',
            '..',
            '__tests__',
            'uploads',
            `${uuid()}.fasta`,
          );
    fs.writeFileSync(filePath, text);

    return path.basename(filePath);
  }
}
