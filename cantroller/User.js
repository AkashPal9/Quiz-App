const User=require("../models/UserModel");
const bcrypt = require('bcrypt');
const {generateToken} = require("../utils/generateToken.js");

const SignUp=async(req,res)=>{
    try {
        let {email,password,name,isAdmin}=req.body;
        const user=await User.findOne({email});
        if(user){
          res.status(400).json("User is already exist")
        console.log("User is already exist")
        }
   let create_user=await User.create({
    email,password,name,isAdmin
   })
   create_user = JSON.parse(JSON.stringify(create_user));
   
   if (!create_user) console.log("Unexpected error occured while creating user!", "badRequest");

   return res.status(201).json({
     success: true,
     message: "user created successfully",
   })
    } catch (error) {
        console.log(error,"Internal server error")
    }
}


const login=async(req,res)=>{
try {
    const {email,password}=req.body;
    const user=await User.findOne({email});
    // user = JSON.parse(JSON.stringify(user));
    if (!user) {
        // User not found
        return res.status(401).json({ message: 'Invalid email or password' });
      }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      // Passwords don't match
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    console.log(user._id,"userid")
    generateToken(res, user._id);
    return res.status(200).json({ message: 'Logged in successfully'});
} catch (error) {
    console.log(error,"internal server error")
}
}

const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};


module.exports={
    SignUp,
    login,
    logoutUser
}