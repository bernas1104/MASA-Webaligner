import 'dotenv/config';

import { mailQueue, masaQueue } from './lib/Queue';

masaQueue.bull.process(() => masaQueue.handle);
mailQueue.bull.process(() => mailQueue.handle);
