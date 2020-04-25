const Sequelize = require('sequelize');

const databaseConfig = require('./config.json');

const { database, username, password, host, dialect } = databaseConfig.development;
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
