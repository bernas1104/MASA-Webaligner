import { injectable, inject } from 'tsyringe';
import Bull, { Job, Queue } from 'bull';
import 'reflect-metadata';
import '@shared/container/providers';

import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IAlignerProvider from '@shared/container/providers/AlignerProvider/models/IAlignerProvider';

import IRequestAlignmentDTO from '@shared/container/providers/AlignerProvider/dtos/IRequestAlignmentDTO';
import ISendMailDTO from '@shared/container/providers/MailProvider/dtos/ISendMailDTO';
import IQueueProvider from '../models/IQueueProvider';

// import { MASACUDAlign, MASAOpenMP } from './BullQueues/MASAAlignment';
// import AlignmentReadyMail from './BullQueues/AlignmentReadyMail';

@injectable()
export default class BullQueueProvider implements IQueueProvider {
  private MASAQueue: Queue;

  private MailQueue: Queue;

  constructor(
    @inject('MailProvider')
    private mailProvider: IMailProvider,

    @inject('MASAAlignerProvider')
    private masaProvider: IAlignerProvider,
  ) {
    this.MASAQueue = new Bull('MASAQueue');
    this.MailQueue = new Bull('MailQueue');
  }

  public async addMASAJob(data: IRequestAlignmentDTO): Promise<Job> {
    const job = await this.MASAQueue.add(data);
    return job;
  }

  public async addMailJob(data: ISendMailDTO): Promise<Job> {
    const job = await this.MailQueue.add(data);
    return job;
  }

  public async processMASAJobs(): Promise<void> {
    this.MASAQueue.process(async job => {
      const data = job.data as IRequestAlignmentDTO;
      return this.masaProvider.processAlignment(data);
    });
  }

  public async processMailJobs(): Promise<void> {
    this.MailQueue.process(async job => {
      const data = job.data as ISendMailDTO;
      return this.mailProvider.sendMail(data);
    });
  }
}

// MASACUDAlign.bull.process(async job => {
//   const data = job.data as IRequestAlignmentDTO;
//   MASACUDAlign.handle(data);
// });

// MASAOpenMP.bull.process(async job => {
//   const data = job.data as IRequestAlignmentDTO;
//   MASAOpenMP.handle(data);
// });

// AlignmentReadyMail.bull.process(async job => {
//   const data = job.data as ISendMailDTO;
//   AlignmentReadyMail.handle(data);
// });

// MASACUDAlign.bull.on('failed', (job, err) => {
//   console.log('Job failed', MASACUDAlign.name, job.data);
//   console.log(err);
// });

// MASACUDAlign.bull.on('completed', async job => {
//   console.log('Job completed', MASACUDAlign.name, job.data);

//   const { fullName, email, id } = job.data;

//   if (
//     fullName !== undefined &&
//     fullName !== '' &&
//     email !== undefined &&
//     email !== ''
//   ) {
//     await job.progress(50);

//     AlignmentReadyMail.bull.add({
//       fullName,
//       email,
//       address: `http://masa-webaligner.unb.br/alignments/${id}`,
//     });
//   }

//   await job.progress(100);
// });
