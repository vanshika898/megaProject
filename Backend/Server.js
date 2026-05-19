const express  = require("express");
const app = express();
require('dotenv').config();
app.use(express.json());
const db = require('./config/Database');
const cookieParser = require('cookie-parser');

app.use(cookieParser());

db.sync();

const PORT = process.env.PORT || 3000;

const routes = require('./routes/UserRoutes');

app.use("/api/v1",routes);

app.get('/', (req, res) => {

  res.send("User Route Working");

});

app.listen(PORT,()=>{
  console.log(`App listen on http://localhost:${PORT}`);
})