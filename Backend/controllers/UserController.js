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


exports.sendResetPasswordLink = async(req,res)=>{
  try{
    const userId = req.user.id;
    const {email} = req.body;
    const user = await User.findOne({where:{id:userId,email}});
    if(!user){
      return res.status(404).json({
        success:false,
        message:"User not found"
      })
    }
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
    subject: 'Reset Password Link',

    html: `
    
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 40px;">

        <div style="max-width: 500px; background: white; margin: auto; padding: 30px; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0,0,0,0.1);">

            <h2 style="text-align: center; color: #333;">
                Reset Your Password
            </h2>

            <p style="color: #555; font-size: 16px;">
                Hello,
            </p>

            <p style="color: #555; font-size: 16px;">
                We received a request to reset your password.
                Click the button below to create a new password.
            </p>

            <div style="text-align: center; margin: 30px 0;">

                <a 
                    href="http://localhost:3000/api/v1/user/password/reset"
                    style="
                        background-color: #4CAF50;
                        color: white;
                        padding: 12px 25px;
                        text-decoration: none;
                        border-radius: 5px;
                        font-size: 16px;
                        display: inline-block;
                    "
                >
                    Reset Password
                </a>

            </div>

            <p style="color: #777; font-size: 14px;">
                If you did not request a password reset, you can safely ignore this email.
            </p>

            <hr style="margin-top: 30px;">

            <p style="text-align: center; color: #999; font-size: 12px;">
                © 2026 Your Company. All rights reserved.
            </p>

        </div>

    </div>

    `
});
 return res.status(200).send('Reset password link sent successfully');
  }catch(error){
    res.status(500).json({
      sucess:false,
      message:'Some error in sending reset passsword link',
      error:error.message
    })
  }
}


exports.ResetPassword = async(req,res)=>{
  try
  {
    const userId = req.user.id;
    const {email,newPassword} = req.body;
    const user = await User.findOne({where:{id:userId,email}});
    if(!user){
      return res.status(404).json({
        success:false,
        message:"User not found"
      })
    }

   const hash = await bcrypt.hash(newPassword,10);
   const setPassword = await User.update({password:hash},{where:{id:userId,email}});
   if(!setPassword){
    return res.status(500).json({
      success:false,
      message:"Unable to reset password"
    })
   }
   return res.status(200).json({
  success:true,
  message:"Password reset successfully"

   })

  }catch(error){
   return res.status(500).json({
      sucess:false,
      message:'Some error in resetting password',
      error:error.message
    })
  }
   
}