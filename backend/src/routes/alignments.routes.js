const { Router } = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadConfig = require('./../config/upload');

const Alignment = require('../models/Alignment');
const Sequence = require('../models/Sequence');

const validadeCreateAlignment = require('./../validations/validateCreateAlignment');

const GetFileNameService = require('./../services/GetFileNameService');
const SelectMASAExtensionService = require('./../services/SelectMASAExtensionService');
const CreateAlignmentService = require('../services/CreateAlignmentService');
const CreateSequenceService = require('../services/CreateSequenceService');

const { masaQueue } = require('./../lib/Queue');

const alignmentsRouter = Router();
const upload = multer(uploadConfig);

alignmentsRouter.post('/', upload.fields([
  { name: 's0input', maxCount: 1 },
  { name: 's1input', maxCount: 1 }]),
  validadeCreateAlignment, async (request, response) => {
    const { extension, only1, clearn, complement, reverse, blockPruning,
        s0origin, s1origin, s0edge, s1edge, s0input, s1input, fullName,
        email } = request.body;

    const getFileNameService = new GetFileNameService();

    const s0 = await getFileNameService.execute({
        num: 0,
        type: s0origin,
        input: s0input,
        files: request.files,
    });
    s0folder = s0 !== undefined ? s0.match(/.*[^\.fasta]/g)[0] : null;

    const s1 = await getFileNameService.execute({
        num: 1,
        type: s1origin,
        input: s1input,
        files: request.files,
    });
    s1folder = s1 !== undefined ? s1.match(/.*[^\.fasta]/g)[0] : null;

    const filesPath = path.resolve(__dirname, '..', '..', 'uploads');
    const resultsPath = path.resolve(__dirname, '..', '..', 'results');

    const createAlignmentService = new CreateAlignmentService();

    const alignment = await createAlignmentService.execute({ extension, only1,
        clearn, complement, reverse, blockPruning, fullName, email });

    const createSequenceService = new CreateSequenceService();

    const sequence0 = await createSequenceService.execute({ file: s0,
        size: fs.statSync(path.join(filesPath, s0)).size, origin: s0origin,
        edge: s0edge, alignmentId: alignment.id });

    const sequence1 = await createSequenceService.execute({ file: s1,
        size: fs.statSync(path.join(filesPath, s1)).size, origin: s1origin,
        edge: s1edge, alignmentId: alignment.id });

    const selectMASAExtensionService = new SelectMASAExtensionService();
    const masa = selectMASAExtensionService.execute({
        extension, filesPath, s0, s1
    });

    masaQueue.bull.add({ masa, only1, clearn, complement, reverse,
        blockPruning, s0, s1, s0edge, s1edge, fullName, email, s0folder,
        s1folder, filesPath, resultsPath, id: alignment.id });

    return response.json({alignment, sequence0, sequence1});
  }
);

alignmentsRouter.get('/:id', async (request, response) => {
  const { id } = request.params;

  const alignment = await Alignment.findByPk(id);

  const sequences = await Sequence.findAll({ where: { alignmentId: id }});

  return response.json({ alignment, sequences });
});

module.exports = alignmentsRouter;
