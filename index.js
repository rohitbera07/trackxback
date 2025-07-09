require('dotenv').config();
const express =require('express')
const cors =require('cors')
const mongoose = require('mongoose')

const app=express();
app.use(express.json());
app.use(cors({
  origin: 'https://trackfrontx.vercel.app', // 👈 Replace this with your actual Vercel domain
  credentials: true, // Optional: if you use cookies or auth headers
}));
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(()=>{console.log("Connected to Mongodb")})
    .catch((err)=>{console.log(err)})
     
    // Import routes
    const projectDetails=require("./routes/projectDetails")
    app.use('/user',projectDetails);
const authRoutes = require("./routes/authRoutes");
app.use("/user", authRoutes);
const create=require("./routes/createProject")
app.use("/user",create);
const sendReq=require("./routes/sendReq")
const join=require("./routes/joinReq")
app.use('/user',sendReq)
app.use('/user',join)
    const PORT = process.env.PORT || 5000
    app.listen(PORT,()=>{console.log("Server started")})
