const Queue = require('bull');
const redisConfig = require('./../config/redis');

const AlignmentReadyMail = require('./../jobs/AlignmentReadyMail');
const MASAAlignment = require('./../jobs/MASAAlignment');

const mailQueue = new Queue(AlignmentReadyMail.key, redisConfig);
mailQueue.on('failed', (job, err) => {
    console.log(job, err);
});

const masaQueue = new Queue(MASAAlignment.key, redisConfig);
masaQueue.on('failed', (job, err) => {
    console.log(job, err);
});
masaQueue.on('completed', (job) => {
    console.log(`Job ${job.name} is done!`);
});

module.exports = {mailQueue, masaQueue};