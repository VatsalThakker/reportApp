const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const cors = require("cors");
const userRoutes = require("./routes/userRoutes")
const studentRoutes = require("./routes/studentRoutes")
const reportRoutes = require("./routes/reportRoutes")
dotenv.config({path:"./config/.env"})
const app = express()
app.use(express.json())
app.use(cors());
app.use('/api',userRoutes)
app.use('/api',studentRoutes)
app.use('/api',reportRoutes)
mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log('MonogoDB Connected');
        app.listen(process.env.PORT,()=>{
            console.log(`Server Started ${process.env.PORT}`);
        })
    }).catch(err=>{
        console.error('Databases Connection Error:',err);
    });