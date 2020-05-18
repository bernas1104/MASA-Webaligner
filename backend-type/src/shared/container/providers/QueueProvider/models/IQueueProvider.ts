import { Job } from 'bull';

import IAlignmentRequestDTO from '@shared/container/providers/AlignerProvider/dtos/IRequestAlignmentDTO';
import ISendMailDTO from '@shared/container/providers/MailProvider/dtos/ISendMailDTO';

export default interface IQueueProvider {
  addMASAJob(data: IAlignmentRequestDTO): Promise<Job>;
  addMailJob(data: ISendMailDTO): Promise<Job>;

  processMASAJobs(): Promise<void>;
  processMailJobs(): Promise<void>;

  eventListnerMASA(): void;
  eventListnerMail(): void;
}
