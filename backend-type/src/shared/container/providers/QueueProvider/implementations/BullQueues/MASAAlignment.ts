import Queue from 'bull';
import { container } from 'tsyringe';

import redisConfig from '@config/redis';

import MASACUDAlignAlignerProvider from '@shared/container/providers/AlignerProvider/implementations/MASACUDAlignAlignerProvider';
import MASAOpenMPAlignerProvider from '@shared/container/providers/AlignerProvider/implementations/MASAOpenMPAlignerProvider';

export const MASACUDAlign = {
  bull: new Queue('MASA CUDAlign Alignment', {
    redis: {
      host: redisConfig.host,
      port: redisConfig.port,
    },
  }),
  name: 'MASA CUDAlign Alignment',
  handle: container.resolve(MASACUDAlignAlignerProvider).processAlignment,
};

export const MASAOpenMP = {
  bull: new Queue('MASA OpenMP Alignment', {
    redis: {
      host: redisConfig.host,
      port: redisConfig.port,
    },
  }),
  name: 'MASA OpenMP Alignment',
  handle: container.resolve(MASAOpenMPAlignerProvider).processAlignment,
};
