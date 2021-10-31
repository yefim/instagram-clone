const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('post', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    photoUrl: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    caption: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
  });
};
