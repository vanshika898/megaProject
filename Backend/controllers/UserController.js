const User = require('../models/UserModel');
const OTP = require('../models/OTPModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer')
const otpGenerator = require('otp-generator');
require('dotenv').config();


exports.SignUpUser = async(req,res)=>{
  try{
  const {id,first_name,last_name,email,phoneNo,password,accountType} = req.body;

  const saltRounds = 10 ; 
  const hashedPassword = await bcrypt.hash(password,10);
  console.log(hashedPassword);


   
  const createUser = await User.create({id,first_name,last_name,email,phoneNo,password:hashedPassword,accountType});




res.status(200).json({
    success:true,
    message:"SignUp successfully",
    data:createUser,
  })
  }catch(error){
   res.status(500).json({
    success :false,
    message:"Some error in signup",
    error:error.message
   })
  }
  }


  exports.loginUser = async(req,res)=>{
    try{
      //extract email and password
     const{email,password} = req.body;
     if(!email || !password){
      return res.status(400).json({
        success:false,
        message:"Fill the details carefully"
      })
     }
     

     // const findEmail 
     const existingUser = await User.findOne({
      where:{
     email
      }
     });
     
     if(!existingUser){
     return res.status(404).json({
        message:"User not found",
        success:false
      })
     }
     
  const isMatched = await bcrypt.compare(
      password,
      existingUser.password
    );
    
    if(!isMatched){
      return res.status(400).json({
         message:"password is not matched",
        success:false
      })
    }

const otp = otpGenerator.generate(4,{digits:true,upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false});
try{
  await OTP.create({email,otp});
   const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.USER_EMAIL,
                pass: process.env.APP_PASS
            }
        });
         await transporter.sendMail({
            from: process.env.USER_EMAIL,
            to: email,
            subject: 'OTP Verification',
            text: `Your OTP for verification is: ${otp}`
        });
 return res.status(200).send('OTP sent successfully');

}catch(error){
  res.status(500).json({
    message:"unable to send otp",
    error:error.message
    
  })

}

   
     
    //  const payload = {
    //   email:existingUser.email,
    //   id:existingUser.id,
    //   accountType:existingUser.accountType
    //  }

    // //  let token;
    //  // generate token
    
    //   let token  = jwt.sign(payload,process.env.JWT_SECRET,{
    //     expiresIn:"2h"
    //   })
    
     
    // //  existingUser = existingUser.toObject();
    //  existingUser.token =token;
    //  existingUser.password = undefined;

    //  console.log("existinguser:",existingUser);
    //  const options={
    // expires:new Date(Date.now()+3*24*60*60*1000),
    // httpOnly:true,


  
  // }
    //  res.cookie("token",token,options).status(200)

    //  .json({
    //    success:true,
    //    message:"Successfully logged in..",
    //    token,
    //    data:existingUser
    //   })


    }catch(error){
    res.status(500).json({
    success :false,
    message:"Some error login",
    error:error.message
   })
    }
  }


 exports.verifyOTP = async (req, res) => {

  try {

    const { email, otp } = req.body;

    // validation
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "OTP and email required"
      });
    }

    // find latest otp
    const recentOTP = await OTP.findOne({
      where: { email },
      order: [['createdAt', 'DESC']]
    });

    // otp not found
    if (!recentOTP) {
      return res.status(404).json({
        success: false,
        message: "OTP not found"
      });
    }

    // compare otp
    if (recentOTP.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    // find user
    const existingUser = await User.findOne({
      where: { email }
    });

    // payload
    const payload = {
      email: existingUser.email,
      id: existingUser.id,
      accountType: existingUser.accountType
    };

    // generate token
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: "2h"
      }
    );

    // attach token
    existingUser.token = token;

    // hide password
    existingUser.password = undefined;

    // cookie options
    const options = {
      expires: new Date(
        Date.now() + 3 * 24 * 60 * 60 * 1000
      ),
      httpOnly: true
    };

    return res
      .cookie("token", token, options)
      .status(200)
      .json({
        success: true,
        message: "Login successful",
        token,
        data: existingUser
      });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Error while verifying OTP",
      error: error.message
    });

  }

};

