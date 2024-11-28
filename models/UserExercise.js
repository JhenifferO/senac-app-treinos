const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Exercise = require('./Exercise');

const UserExercise = sequelize.define('UserExercise', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  exercise_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  assigned_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'user_exercises',
  timestamps: false,
});

UserExercise.belongsTo(Exercise, { foreignKey: 'exercise_id', as: 'exercise' });

module.exports = UserExercise;