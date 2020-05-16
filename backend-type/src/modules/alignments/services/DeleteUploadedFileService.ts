import path from 'path';
import { execSync } from 'child_process';

require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

interface DeleteUploadedDTO {
  fileName: string;
}

export default class DeleteUploadedFileService {
  async execute({ fileName }: DeleteUploadedDTO): Promise<void> {
    const filePath =
      process.env.NODE_ENV !== 'test'
        ? path.resolve(__dirname, '..', '..', 'uploads', fileName)
        : path.resolve(__dirname, '..', '..', '__tests__', 'uploads', fileName);
    await execSync(`rm ${filePath}`);
  }
}
