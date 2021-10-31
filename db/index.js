const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'dev.db',
  logQueryParameters: true,
  benchmark: true,
});

module.exports = sequelize;
