require('dotenv').config();
const express =require('express')
const cors =require('cors')
const mongoose = require('mongoose')

const app=express();
app.use(express.json());
app.use(cors());
mongoose.connect(process.env.MONGO_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(()=>{console.log("Connected to Mongodb")})
    .catch((err)=>{console.log("database error")})
     
    // Import routes
const authRoutes = require("./routes/authRoutes");
app.use("/user", authRoutes);

    const PORT = process.env.PORT || 5000
    app.listen(PORT,()=>{console.log("Server started")})