const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', 'M8398k0803$', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;
