import fs from 'fs';
import path from 'path';
import Bull, { Job, Queue } from 'bull';
import { injectable, inject, container } from 'tsyringe';

import redisConfig from '@config/redis';
import '@shared/container/providers';

import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IAlignerProvider from '@shared/container/providers/AlignerProvider/models/IAlignerProvider';
import IAlignmentsRepository from '@modules/alignments/repositories/IAlignmentsRepository';

import IRequestAlignmentDTO from '@shared/container/providers/AlignerProvider/dtos/IRequestAlignmentDTO';
import upload from '@config/upload';
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

      this.masaProvider.executeStage1(data);

      if (!data.only1) {
        await job.progress(50);

        this.masaProvider.executeStage2(data);
        await job.progress(62.5);

        this.masaProvider.executeStage3(data);
        await job.progress(75);

        this.masaProvider.executeStage4(data);
        await job.progress(87.5);

        this.masaProvider.executeStage5(data);
      }

      await job.progress(100);
    });

    this.eventListnerMASA();
  }

  public eventListnerMASA(): void {
    this.MASAQueue.on('failed', async (job, err) => {
      const {
        id,
        full_name,
        email,
        only1,
        s0,
        s1,
      } = job.data as IRequestAlignmentDTO;

      if (err.message.includes('job stalled more than allowable limit')) {
        let ready = false;

        if (only1) {
          ready = fs.existsSync(
            path.resolve(
              upload.resultsFolder,
              `${path.parse(s0).name}-${path.parse(s1).name}`,
              'statistics_01.00',
            ),
          );
        } else {
          ready = fs.existsSync(
            path.resolve(
              upload.resultsFolder,
              `${path.parse(s0).name}-${path.parse(s1).name}`,
              'alignment.00.bin',
            ),
          );
        }

        if (ready) {
          const alignmentsRepository = container.resolve<IAlignmentsRepository>(
            'AlignmentsRepository',
          );

          setTimeout(async () => {
            await alignmentsRepository.updateAlignmentSituation(id);
          }, 2000);

          if (email !== undefined && email !== '')
            await this.sendReadyMail(id, full_name, email);
        }
      }

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

      if (email !== undefined && email !== '')
        await this.sendReadyMail(id, full_name, email);
    });
  }

  private async sendReadyMail(
    id: string,
    full_name: string,
    email: string,
  ): Promise<void> {
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
          address: `http://masa-webaligner.unb.br/results/${id}`,
        },
      },
    });
  }

  public getQueues(): Queue[] {
    return [this.MASAQueue];
  }
}
