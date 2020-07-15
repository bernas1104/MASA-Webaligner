/* eslint-disable @typescript-eslint/interface-name-prefix */
// import { Express as exp } from 'express';

declare namespace Express {
  export interface Request {
    files: any;
    savedFiles: {
      s0?: string;
      s1?: string;
    };
  }
}
