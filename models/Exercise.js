const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Exercise = sequelize.define('Exercise', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  series: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  repetitions: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: true,
  tableName: 'exercises',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Exercise;