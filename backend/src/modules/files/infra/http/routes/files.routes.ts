import { Router } from 'express';

import BinaryFilesController from '../controllers/BinaryFilesController';
import FastaFilesController from '../controllers/FastaFilesController';

const filesRouter = Router({ strict: true });

const binaryFilesController = new BinaryFilesController();
const fastaFilesController = new FastaFilesController();

filesRouter.get('/bin/:alignment_id', binaryFilesController.show);
filesRouter.get('/fasta/:alignment_id', fastaFilesController.show);

export default filesRouter;
