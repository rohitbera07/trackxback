const mongoose = require('mongoose')
 const userSchema = new mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String, required:true, unique: true},
    password:{type:String,require:true,minlength: 8},
 });
  
 module.exports= mongoose.model("User",userSchema);