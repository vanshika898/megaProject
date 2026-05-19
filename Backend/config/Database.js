const { Sequelize } = require('sequelize');
require('dotenv').config();
//give the values to the pool object
const seq= new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT

  }

);

seq.authenticate().then(()=>{
  console.log("Database connected successfully")
}).catch((err)=>{
  console.log("Error:",err.message);
})


module.exports = seq;
