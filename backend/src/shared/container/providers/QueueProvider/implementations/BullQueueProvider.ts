import Bull, { Job, Queue } from 'bull';

import redisConfig from '@config/redis';

import IRequestAlignmentDTO from '@shared/container/providers/AlignerProvider/dtos/IRequestAlignmentDTO';
import IQueueProvider from '../models/IQueueProvider';

export default class BullQueueProvider implements IQueueProvider {
  private MASAQueue: Queue;

  constructor() {
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

  public getMASAQueue(): Queue {
    return this.MASAQueue;
  }
}
