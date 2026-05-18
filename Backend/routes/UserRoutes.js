const express  = require('express');
const router = express.Router();

const {SignUpUser} = require('../controllers/UserController');
router.get('/test',(req,res)=>{
  res.send("Route working");
});
router.post('/user/signup',SignUpUser);

module.exports = router;