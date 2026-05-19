const User = require('../models/UserModel');

exports.SignUpUser = async(req,res)=>{
  try{
  const {id,first_name,last_name,email,phoneNo,createPassword,confirmPassword,accountType} = req.body;
   
  const createUser = await User.create({id,first_name,last_name,email,phoneNo,createPassword,confirmPassword,accountType});

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

