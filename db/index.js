const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'dev.db',
  logQueryParameters: true,
  benchmark: true,
});

require('./models/user')(sequelize);
require('./models/post')(sequelize);

module.exports = sequelize;
