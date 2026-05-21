const express  = require("express");
const app = express();
require('dotenv').config();
const passport = require('./config/passport');
const session = require('express-session');
app.use(express.json());
const db = require('./config/Database');
const cookieParser = require('cookie-parser');

app.use(cookieParser());

db.sync();

const PORT = process.env.PORT || 3000;

const authRoute = require('./routes/authRoute')

app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
  })
);

app.use(passport.initialize());
app.use(passport.session());



// const routes = require('./routes/UserRoutes');
// app.use("/api/v1",auth,routes);
// app.use('/auth',authRoute)

const routes = require('./routes/index');
app.use("/api/v1",routes);

app.get('/', (req, res) => {

  res.send("User Route Working");

});

app.listen(PORT,()=>{
  console.log(`App listen on http://localhost:${PORT}`);
})