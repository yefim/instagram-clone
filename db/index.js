const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'dev.db',
  logQueryParameters: true,
  benchmark: true,
});

require('./models/user')(sequelize);

module.exports = sequelize;
