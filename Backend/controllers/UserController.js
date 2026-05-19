const User = require('../models/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
require('dotenv').config();


exports.SignUpUser = async(req,res)=>{
  try{
  const {id,first_name,last_name,email,phoneNo,password,accountType} = req.body;

  const saltRounds = 10 ; 
  const hashedPassword = await bcrypt.hash(password,10);
  console.log(hashedPassword);


   
  const createUser = await User.create({id,first_name,last_name,email,phoneNo,password:hashedPassword,accountType});

  return res.status(200).json({
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

     
     const payload = {
      email:existingUser.email,
      id:existingUser.id,
      accountType:existingUser.accountType
     }

    //  let token;
     // generate token
    
      let token  = jwt.sign(payload,process.env.JWT_SECRET,{
        expiresIn:"2h"
      })
    
     
    //  existingUser = existingUser.toObject();
     existingUser.token =token;
     existingUser.password = undefined;

     console.log("existinguser:",existingUser);
     const options={
    expires:new Date(Date.now()+3*24*60*60*1000),
    httpOnly:true,


  
  }
     res.cookie("token",token,options).status(200)

     .json({
       success:true,
       message:"Successfully logged in..",
       token,
       data:existingUser
      })


    }catch(error){
    res.status(500).json({
    success :false,
    message:"Some error in signup",
    error:error.message
   })
    }
  }



