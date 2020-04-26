const Sequelize = require('sequelize');
require('dotenv').config({
    path: process.env.NODE_ENV === 'test' ? ".env.test" : '.env'
});

const databaseConfig = require('./config.json');

const { database, username, password, host, dialect } = process.env.NODE_ENV !== 'test' ?
    databaseConfig.development :
    databaseConfig.test;

const sequelize = new Sequelize(
  database,
  username,
  password,
  {
    host,
    dialect,
    logging: false,
  }
);

module.exports = sequelize;
