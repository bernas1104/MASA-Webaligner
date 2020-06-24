import 'reflect-metadata';
import 'dotenv/config';

import path from 'path';
import { format } from 'date-fns';
import { container } from 'tsyringe';

import '@shared/infra/typeorm';
import '@shared/container/queueIndex';

import IAlignmentsRepository from '@modules/alignments/repositories/IAlignmentsRepository';

import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IRequestAlignmentDTO from '@shared/container/providers/AlignerProvider/dtos/IRequestAlignmentDTO';
import IAlignerProvider from '@shared/container/providers/AlignerProvider/models/IAlignerProvider';
import IQueueProvider from '@shared/container/providers/QueueProvider/models/IQueueProvider';

const bull = container.resolve<IQueueProvider>('QueueProvider');
const MASAQueue = bull.getMASAQueue();

async function sendReadyMail(
  id: string,
  full_name: string,
  email: string,
): Promise<void> {
  const mailProvider = container.resolve<IMailProvider>('MailProvider');

  await mailProvider.sendMail({
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

MASAQueue.process(async job => {
  const masaProvider = container.resolve<IAlignerProvider>(
    'MASAAlignerProvider',
  );

  const data = job.data as IRequestAlignmentDTO;
  const { id } = data;

  masaProvider.executeStage1(data);

  if (!data.only1) {
    await job.progress(35);

    masaProvider.executeStage2(data);
    await job.progress(47.5);

    masaProvider.executeStage3(data);
    await job.progress(60);

    masaProvider.executeStage4(data);
    await job.progress(72.5);

    masaProvider.executeStage5(data);
  }

  await job.progress(85);

  const alignmentsRepository = container.resolve<IAlignmentsRepository>(
    'AlignmentsRepository',
  );

  await alignmentsRepository.updateAlignmentSituation(id);

  await job.progress(100);
});

MASAQueue.on('failed', async () => {
  console.log('Job failed', MASAQueue.name);
  console.log(format(Date.now(), 'HH:mm:ss'));
});

MASAQueue.on('completed', async job => {
  const { id, full_name, email } = job.data;

  if (email !== undefined && email !== '')
    await sendReadyMail(id, full_name, email);

  console.log('Job completed', MASAQueue.name);
  console.log(format(Date.now(), 'HH:mm:ss'));
});

console.log('Processing queue... 🚀 ');
