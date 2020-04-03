require('dotenv/config');

const Queue = require('./lib/Queue');

const { masaQueue, mailQueue } = Queue;

masaQueue.bull.process(masaQueue.handle);
mailQueue.bull.process(mailQueue.handle);