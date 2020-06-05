import path from 'path';
import Bull, { Job, Queue } from 'bull';
import { injectable, inject, container } from 'tsyringe';

import redisConfig from '@config/redis';
import '@shared/container/providers';

import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IAlignerProvider from '@shared/container/providers/AlignerProvider/models/IAlignerProvider';
import IAlignmentsRepository from '@modules/alignments/repositories/IAlignmentsRepository';

import IRequestAlignmentDTO from '@shared/container/providers/AlignerProvider/dtos/IRequestAlignmentDTO';
import IQueueProvider from '../models/IQueueProvider';

@injectable()
export default class BullQueueProvider implements IQueueProvider {
  private MASAQueue: Queue;

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
  }

  public async addMASAJob(data: IRequestAlignmentDTO): Promise<Job> {
    const job = await this.MASAQueue.add(data);
    return job;
  }

  public async processMASAJobs(): Promise<void> {
    this.MASAQueue.process(async job => {
      const data = job.data as IRequestAlignmentDTO;
      return this.masaProvider.processAlignment(data);
    });

    this.eventListnerMASA();
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

      setTimeout(async () => {
        await alignmentsRepository.updateAlignmentSituation(id);
      }, 2000);

      await job.progress(50);

      if (email !== undefined && email !== '') {
        await job.progress(75);

        await this.mailProvider.sendMail({
          to: {
            name: full_name || 'user',
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

  public getQueues(): Queue[] {
    return [this.MASAQueue];
  }
}
