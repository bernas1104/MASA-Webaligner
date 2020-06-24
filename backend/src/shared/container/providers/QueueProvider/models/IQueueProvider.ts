import { Job, Queue } from 'bull';

import IAlignmentRequestDTO from '@shared/container/providers/AlignerProvider/dtos/IRequestAlignmentDTO';

export default interface IQueueProvider {
  addMASAJob(data: IAlignmentRequestDTO): Promise<Job>;
  getMASAQueue(): Queue;
}
