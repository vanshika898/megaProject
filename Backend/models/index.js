const User = require('./UserModel');
const OTP = require('./OTPModel');

User.hasMany(OTP, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
});

OTP.belongsTo(User, {
  foreignKey: 'userId'
});

module.exports = {
  User,
  OTP
  
};