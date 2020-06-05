import { Job } from 'bull';

import IAlignmentRequestDTO from '@shared/container/providers/AlignerProvider/dtos/IRequestAlignmentDTO';

export default interface IQueueProvider {
  addMASAJob(data: IAlignmentRequestDTO): Promise<Job>;

  processMASAJobs(): Promise<void>;

  eventListnerMASA(): void;
}
