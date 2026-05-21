const {Profile} = require('../models/Profile');
const User = require('../models/UserModel');

exports.createProfile = async(req,res)=>{
  try{
    const{email,image,gender,dateOfBirth} = req.body;
 
    const userId = req.user.id;

   const user = await User.findOne({where:{id:userId}});
   
    if(!user){

      return res.status(404).json({

        success:false,
        message:"User not found"

      });

    }
   
    const saveData = await Profile.create({userId,image,gender,dateOfBirth});

      return res.status(200).json({
      success:true,
      message:"profile saved successfully",
      data:saveData
     
    })



  }catch(error){
    res.status(500).json({
      success:false,
      message:"Unable to save profile details",
      error:error.message
    })
  }
}

exports.getProfile = async(req,res)=>{
  try{
    const userId = req.user.id;
    const user  = await User.findOne({where:{id:userId}});
    if(!user){
      return res.status(404).json({
        success:false,
        message:"User not found"
      })
    }
    const profile = await Profile.findOne({where:{userId}});
    if(!profile){
      return res.status(404).json({
        success:false,
        message:"Profile data not found"
      })
    }
    return res.status(200).json({
      success:true,
      message:"Profile found",
      data:profile
    })

  }catch(error){
res.status(500).json({
      success:false,
      message:"Unable to save profile details",
      error:error.message
    })
  }
}


exports.updateProfile = async(req,res)=>{
  try{

    const userId = req.user.id;
    const user  = await User.findOne({where:{id:userId}});
    if(!user){
      return res.status(404).json({
        success:false,
        message:"User not found"
      })
    }
    const profile = await Profile.update(req.body,{where:{userId}});
    if(!profile){
      return res.status(404).json({
        success:false,
        message:"Profile data not found"
      })
    }
    return res.status(200).json({
      success:true,
      message:"Profile updated successfully",
      data:profile
    })

  }catch(error){
    return res.status(500).json({
      success:false,
      message:"Unable to update profile details",
      error:error.message
    })
  }
}

exports.updateImage = async(req,res)=>{
  try{

    const userId = req.user.id;
    const user  = await User.findOne({where:{id:userId}});
    if(!user){
      return res.status(404).json({
        success:false,
        message:"User not found"
      })
    }
const updateImage = await Profile.update({
  image:req.body.image},{where:{userId}});
    if(!updateImage){
      return res.status(404).json({
        success:false,
        message:"Profile data not found"
      })
    }
    return res.status(200).json({
      success:true,
      message:"Profile image updated successfully",
      data:updateImage
    })
  

  }catch(error){
    return res.status(500).json({
      success:false,
      message:"Unable to update profile image",
      error:error.message
    })
  }
   

}

exports.updateAbout = async(req,res)=>{
  try{

    const userId = req.user.id;
    const user  = await User.findOne({where:{id:userId}});
    if(!user){
      return res.status(404).json({
        success:false,
        message:"User not found"
      })
    }
const updateAbout = await Profile.update({
  about:req.body.about},{where:{userId}});
    if(!updateAbout){
      return res.status(404).json({
        success:false,
        message:"Profile data not found"
      })
    }
    return res.status(200).json({
      success:true,
      message:"About updated Successfully",
      data:updateAbout
    })
  

  }catch(error){
    return res.status(500).json({
      success:false,
      message:"Unable to update profile about",
      error:error.message
    })
  }  
}




