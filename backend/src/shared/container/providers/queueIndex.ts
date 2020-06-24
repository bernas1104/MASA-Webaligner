import { container } from 'tsyringe';

import IAlignerProvider from '@shared/container/providers/AlignerProvider/models/IAlignerProvider';
import IQueueProvider from '@shared/container/providers/QueueProvider/models/IQueueProvider';

import MASAAlignerProvider from './AlignerProvider/implementations/MASAAlignerProvider';
import BullQueueProvider from './QueueProvider/implementations/BullQueueProvider';

import IMailProvider from './MailProvider/models/IMailProvider';
import EtherealMailProvider from './MailProvider/implementations/EtherealMailProvider';

import IMailTemplateProvider from './MailTemplateProvider/models/IMailTemplateProvider';
import HandlebarsMailTemplateProvider from './MailTemplateProvider/implementations/HandlebarsMailTemplateProvider';

container.registerSingleton<IMailTemplateProvider>(
  'MailTemplateProvider',
  HandlebarsMailTemplateProvider,
);

container.registerInstance<IMailProvider>(
  'MailProvider',
  container.resolve(EtherealMailProvider),
);

container.registerSingleton<IAlignerProvider>(
  'MASAAlignerProvider',
  MASAAlignerProvider,
);

container.registerInstance<IQueueProvider>(
  'QueueProvider',
  container.resolve(BullQueueProvider),
);
