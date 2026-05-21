const User = require('./UserModel');
const {DataTypes} = require('sequelize');
const sequelize = require('../config/Database');
exports.Profile = sequelize.define('Profile',{
id:{
  type:DataTypes.INTEGER,
  autoIncrement: true,
  primaryKey: true
},
userId:{
  type:DataTypes.INTEGER,
  allowNull:false,
  references:{
    model:User,
    key:'id'
  }
},
  image:{
    type:DataTypes.STRING,
    allowNull:true,
  },
  gender:{
   type:DataTypes.STRING,
  allowNull:true,
  },
  dateOfBirth:{
   type:DataTypes.DATE,
   allowNull:true,
  },
  about:{
    type:DataTypes.STRING,
    allowNull:true
  }

}
)



