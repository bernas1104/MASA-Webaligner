import path from 'path';
import Bull, { Job, Queue } from 'bull';
import { injectable, inject, container } from 'tsyringe';

import redisConfig from '@config/redis';
import '@shared/container/providers';

import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IAlignerProvider from '@shared/container/providers/AlignerProvider/models/IAlignerProvider';
import IAlignmentsRepository from '@modules/alignments/repositories/IAlignmentsRepository';

import IRequestAlignmentDTO from '@shared/container/providers/AlignerProvider/dtos/IRequestAlignmentDTO';
import ISendMailDTO from '@shared/container/providers/MailProvider/dtos/ISendMailDTO';
import IQueueProvider from '../models/IQueueProvider';

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
    this.MASAQueue = new Bull('MASAQueue', {
      redis: {
        host: redisConfig.host,
        port: redisConfig.port,
      },
    });

    this.MailQueue = new Bull('MailQueue', {
      redis: {
        host: redisConfig.host,
        port: redisConfig.port,
      },
    });
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

  public eventListnerMASA(): void {
    this.MASAQueue.on('failed', (job, err) => {
      console.log('Job failed', this.MASAQueue.name, job.data);
      console.log(err);
    });

    this.MASAQueue.on('completed', async job => {
      console.log('Job completed', this.MASAQueue.name, job.data);
      const { full_name, email, id } = job.data;

      const alignmentsRepository = container.resolve<IAlignmentsRepository>(
        'AlignmentsRepository',
      );

      await alignmentsRepository.updateAlignmentSituation(id);

      await job.progress(50);

      if (
        full_name !== undefined &&
        full_name !== '' &&
        email !== undefined &&
        email !== ''
      ) {
        await job.progress(75);

        await this.addMailJob({
          to: {
            name: full_name,
            email,
          },
          subject: 'Your sequence alignment is ready!',
          template: {
            file: path.resolve(
              __dirname,
              '..',
              '..',
              '..',
              '..',
              '..',
              'modules',
              'alignments',
              'views',
              'alignment_ready.hbs',
            ),
            variables: {
              full_name,
              address: `http://masa-webaligner.unb.br/${id}`,
            },
          },
        });

        await job.progress(100);
      }
    });
  }

  public eventListnerMail(): void {
    this.MailQueue.on('failed', (job, err) => {
      console.log('Job failed', this.MailQueue.name, job.data);
      console.log(err);
    });

    this.MailQueue.on('completed', async job => {
      console.log('Job completed', this.MailQueue.name, job.data);
      await job.progress(100);
    });
  }

  public getQueues(): Queue[] {
    return [this.MASAQueue, this.MailQueue];
  }
}
