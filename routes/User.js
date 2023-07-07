const express = require('express');
const router = express.Router();
const {SignUp,login,logoutUser}=require("../cantroller/User")

router.post("/signup",SignUp)
router.get("/login",login)
router.post('/logout', logoutUser);

module.exports=router;