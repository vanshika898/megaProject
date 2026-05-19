const {DataTypes} = require('sequelize');
const sequelize = require('../config/Database');

const User = sequelize.define('User',{
id:{
  type:DataTypes.INTEGER,
  autoIncrement:true,
  primaryKey:true
},

first_name:{
type:DataTypes.STRING,
allowNull:false,
validate:{
  len:[3,50]
},
},
last_name:{
type:DataTypes.STRING,
allowNull:false,
validate:{
  len:[3,50]
}
},

email:{
type:DataTypes.STRING,
allowNull:false,
},


password:{
 type: DataTypes.STRING,
  allowNull: false,
  
},
phoneNo:{
type: DataTypes.STRING,
  allowNull: false,
  unique: true,
  validate: {
    len: [10, 15],
    isNumeric: true
  }
},

accountType: {

  type: DataTypes.ENUM(
    'Student',
    'Instructor',
    'Admin'
  ),

  allowNull: false,
  defaultValue: 'Student'

},


})

module.exports = User;