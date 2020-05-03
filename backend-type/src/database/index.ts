import { createConnection } from 'typeorm';

// require('dotenv');

createConnection(/* process.env.NODE_ENV !== 'test' ? 'default' : 'test' */);
