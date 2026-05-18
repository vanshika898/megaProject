const express  = require("express");
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3000;

app.get('/',(req,res)=>{
  res.send("hii my name is vanshika")
})
app.listen(PORT,()=>{
  console.log(`App listen on http://localhost:${PORT}`);
})