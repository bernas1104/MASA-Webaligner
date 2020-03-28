require('dotenv/config');

const Queue = require('./lib/Queue');
const AlignmentReadyMail = require('./jobs/AlignmentReadyMail');
const MASAAlignment = require('./jobs/MASAAlignment');

Queue.mailQueue.process(AlignmentReadyMail.handle);
Queue.masaQueue.process(MASAAlignment.handle);