import { container } from 'tsyringe';

import IStorageProvider from './StorageProvider/models/IStorageProvider';
import DiskStorageProvider from './StorageProvider/implementations/DiskStorageProvider';

// import IMailProvider from './MailProvider/models/IMailProvider';
// import EtherealMailProvider from './MailProvider/implementations/EtherealMailProvider';

// import IMailTemplateProvider from './MailTemplateProvider/models/IMailTemplateProvider';
// import HandlebarsMailTemplateProvider from './MailTemplateProvider/implementations/HandlebarsMailTemplateProvider';

// import IAlignerProvider from './AlignerProvider/models/IAlignerProvider';
// import MASAAlignerProvider from './AlignerProvider/implementations/MASAAlignerProvider';

import IQueueProvider from './QueueProvider/models/IQueueProvider';
import BullQueueProvider from './QueueProvider/implementations/BullQueueProvider';

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  DiskStorageProvider,
);

// container.registerSingleton<IMailTemplateProvider>(
//   'MailTemplateProvider',
//   HandlebarsMailTemplateProvider,
// );

// container.registerInstance<IMailProvider>(
//   'MailProvider',
//   container.resolve(EtherealMailProvider),
// );

// container.registerSingleton<IAlignerProvider>(
//   'MASAAlignerProvider',
//   MASAAlignerProvider,
// );

container.registerInstance<IQueueProvider>(
  'QueueProvider',
  container.resolve(BullQueueProvider),
);
