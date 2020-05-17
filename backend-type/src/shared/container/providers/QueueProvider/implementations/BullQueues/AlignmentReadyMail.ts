import Queue from 'bull';
import { container } from 'tsyringe';

import redisConfig from '@config/redis';
import EtherealMailProvider from '@shared/container/providers/MailProvider/implementations/EtherealMailProvider';

export default {
  bull: new Queue('Alignment Ready Mail', {
    redis: {
      host: redisConfig.host,
      port: redisConfig.port,
    },
  }),
  name: 'Alignment Ready Mail',
  handle: container.resolve(EtherealMailProvider).sendMail,
};
