const express  = require('express');
const router = express.Router();

const {SignUpUser,loginUser,verifyOTP,sendResetPasswordLink,ResetPassword} = require('../controllers/UserController');
const{createProfile,updateImage,updateAbout,getProfile,updateProfile} = require('../controllers/ProfileController');
router.get('/test',(req,res)=>{
  res.send("Route working");
});


router.post('/signup',SignUpUser);
router.post('/login',loginUser);
router.post('/verify',verifyOTP);
router.post('/profile/create',createProfile);
router.get('/profile/get',getProfile);
router.put('/profile/update',updateProfile);
router.patch('/profile/update/image',updateImage);
router.patch('/profile/update/about',updateAbout);

//reset password
router.post('/password/reset-link',sendResetPasswordLink);
router.post('/password/reset',ResetPassword);


module.exports = router;