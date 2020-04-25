const Queue = require('bull');
const redisConfig = require('./../config/redis');

const AlignmentReadyMail = require('./../jobs/AlignmentReadyMail');
const MASAAlignment = require('./../jobs/MASAAlignment');

const mailQueue = {
    bull: new Queue(AlignmentReadyMail.key, redisConfig),
    name: AlignmentReadyMail.key,
    handle: AlignmentReadyMail.handle
};

if(process.env.NODE_ENV !== 'test'){
    mailQueue.bull.on('failed', (job, err) => {
        console.log('Job failed', mailQueue.name, job.data);
        console.log(err);
    });

    mailQueue.bull.on('completed', async job => {
        console.log('Job completed', mailQueue.name, job.data);
        await job.progress(100);
    });
}

const masaQueue = {
    bull: new Queue(MASAAlignment.key, redisConfig),
    name: MASAAlignment.key,
    handle: MASAAlignment.handle
};

if(process.env.NODE_ENV !== 'test'){
    masaQueue.bull.on('failed', (job, err) => {
        console.log('Job failed', masaQueue.name, job.data);
        console.log(err);
    });

    masaQueue.bull.on('completed', async job => {
        console.log('Job completed', masaQueue.name, job.data);

        const { fullName, email, id } = job.data;

        if((fullName !== undefined && fullName !== '') && (email !== undefined && email !== '')){
            await job.progress(50);

            mailQueue.bull.add({
                fullName,
                email,
                address: `http://masa-webaligner.unb.br/alignments/${id}`
            });
        }

        await job.progress(100);
    });
}

module.exports = { mailQueue, masaQueue };
