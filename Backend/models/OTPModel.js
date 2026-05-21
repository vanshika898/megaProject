const { DataTypes } = require('sequelize');
const sequelize = require('../config/Database');
const User = require('./UserModel');
const OTP = sequelize.define("OTP", {

  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },

  otp: {
    type: DataTypes.STRING,
    allowNull: false,
  }

}, {
  timestamps: true
});

module.exports = OTP;