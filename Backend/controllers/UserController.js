const User = require('../models/UserModel');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');
const jwt = require('jsonwebtoken');
const OTP = require('../models/OTPModel');
require('dotenv').config();

exports.SignUpUser = async(req,res)=>{
  try{
    const{first_name,last_name,email,password,phoneNo,accountType}=req.body;

    const hashedPassword = await bcrypt.hash(password,10);
    const createUser = await User.create({first_name,last_name,email,password:hashedPassword,phoneNo,accountType});

    return res.status(200).json({
      success:true,
      message:"The user signed up",
      data:createUser
    })
  }catch(error){
    res.status(500).json({
      sucess:false,
      message:'Some error in Signup',
      error:error.message
    })
  }
}



exports.loginUser = async(req,res)=>{
  try{
    const {email,password}=req.body;
    if(!email || !password){
      return res.status(400).json({
        success:false,
        message:"Fill both the details carefully"
      })
    }
    const existingUser =  await User.findOne({where:{email}});
    if(!existingUser){
     return res.status(404).json({
        success:false,
        message:"User not found"
      })
    }

    const isMatched = await bcrypt.compare(password,existingUser.password);

    if(!isMatched){
      return res.status(404).json({
        success:false,
        message:"Passowrd is not matched"
      })
    }

    const otp = otpGenerator.generate(4,{digits:true,upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false});


      try{

      await OTP.create({
   userId: existingUser.id,
   otp: otp
});
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
      sucess:false,
      message:'error in generating otp',
      error:error.message
    })
      }


  }catch(error){
    res.status(500).json({
      sucess:false,
      message:'Some error in login',
      error:error.message
    })
  }
}



exports.verifyOTP = async(req,res)=>{
  try{
        const { email,otp } = req.body;
  const existingUser = await User.findOne({where:{email}});
        if(!email || !otp){
        return res.status(400).json({
        success:false,
        message:"Fill both the details carefully"
      })
        }
       const recentOtp = await OTP.findOne({
        where:{userId:existingUser.id},
        order:[["createdAt","Desc"]]
       }) 
      if (!recentOtp) {
      return res.status(404).json({
        success: false,
        message: "OTP not found"
      });
    }
      console.log(recentOtp.otp);
    console.log(otp);
     if (recentOtp.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }
  

  
    

    const payload= {
      id:existingUser.id,
      email:existingUser.email,
      accountType:existingUser.accountType
    }
    const options = {
      expires: new Date(
        Date.now() + 3 * 24 * 60 * 60 * 1000
      ),
      httpOnly: true
    };


    const token = jwt.sign(payload,process.env.JWT_SECRET,{ 
        expiresIn: "3d"
      });


    existingUser.token = token;
    existingUser.password = undefined;

    await OTP.destroy({
      where: { userId:existingUser.id }
    });
    return res.cookie("token",token,options).status(200).json({
      sucess:true,
      message:'Successfully verify otp and logged in ',
      token,
      data:existingUser
    })



  }catch(error){
     res.status(500).json({
      sucess:false,
      message:'Some error in login',
      error:error.message
    })
  }
}

