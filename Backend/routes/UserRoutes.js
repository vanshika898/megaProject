const express  = require('express');
const router = express.Router();

const {SignUpUser,loginUser,verifyOTP} = require('../controllers/UserController');
router.get('/test',(req,res)=>{
  res.send("Route working");
});
router.post('/user/signup',SignUpUser);
router.post('/user/login',loginUser);
router.post('/user/verify',verifyOTP);

module.exports = router;