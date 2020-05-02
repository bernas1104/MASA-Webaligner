import 'dotenv/config';

import { mailQueue, masaQueue } from './lib/Queue';
import { MASAAlignmentJob } from './jobs/MASAAlignment';
import { AlignmentReadyMailJob } from './jobs/AlignmentReadyMail';

masaQueue.bull.process(async job => {
  const {
    masa,
    only1,
    clearn,
    complement,
    reverse,
    blockPruning,
    s0,
    s1,
    s0edge,
    s1edge,
    s0folder,
    s1folder,
    filesPath,
    resultsPath,
  } = job.data as MASAAlignmentJob;

  masaQueue.handle({
    masa,
    only1,
    clearn,
    complement,
    reverse,
    blockPruning,
    s0,
    s1,
    s0edge,
    s1edge,
    s0folder,
    s1folder,
    filesPath,
    resultsPath,
  });
});

mailQueue.bull.process(async job => {
  const { fullName, email, address } = job.data as AlignmentReadyMailJob;

  mailQueue.handle({ fullName, email, address });
});
