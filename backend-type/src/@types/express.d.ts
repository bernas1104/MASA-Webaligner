// import { Express as exp } from 'express';

declare namespace Express {
  export interface Request {
    files: {
      s0input: Express.Multer.File[];
      s1input: Express.Multer.File[];
    };
    savedFiles: {
      s0?: string;
      s1?: string;
    };
  }
}
