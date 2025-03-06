const express=require('express')
const bcrypt = require('bcryptjs');
const User = require("../models/User");
const router = express.Router();
const jwt=require("jsonwebtoken")
// -----Signup------
router.post('/signup', async (req,res)=>{
  try{
    const {name,email,password} = req.body;
    const userExists =  await User.findOne({email})
    if(userExists) {
       return res.status(400).json({message:"User already exists"})
    }
    let hashpassword = await bcrypt.hash(password,10)
    const newUser = new User({name,email,password:hashpassword})
    await newUser.save();
     res.status(201).json({message:"User registered successfully"})
  }
  catch(error){
    res.status(500).json({mesage:"server error"})
  }
});
//  ----login-----
router.post('/login', async (req,res)=>{
 try{
  const {email, password} = req.body;
  const user = await User.findOne({email});
  if(!user) { return res.status(400).json({message:"User doesnot exists"})}
  const isMatched = await bcrypt.compare(password, user.password);
  if(!isMatched) { return res.status(400).json({message:"Password is wrong"})}
  const token = jwt.sign({ userId: user._id, role: user.role }, "secretkey", {
    expiresIn: "1h",
  });
  res.json({ message: "Login successful", token });
 }
 catch(error){
  res.status(500).json({message:"Error brother"})
 }
})

const authMiddleware = require("../middlewares/authMiddleware");
// Protected route (Only accessible with valid token)
router.get("/dashboard", authMiddleware, (req, res) => {
  res.json({ message: "Welcome to the dashboard", user: req.user });
});

 module.exports = router;