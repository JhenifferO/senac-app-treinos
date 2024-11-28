const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('fitness_manager', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
