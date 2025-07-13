require('dotenv').config();
const express =require('express')
const cors =require('cors')
const mongoose = require('mongoose')

const app=express();
app.use(express.json());
const allowedOrigins = ['http://localhost:5173'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors());
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
