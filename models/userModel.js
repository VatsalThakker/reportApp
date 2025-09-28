const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    gender:{
        type:String,
        enum: ['male', 'female', 'other'],
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 2
    },
    contactNo: {
        type: String ,
        required: true,
        minlength:10
    },
    role:{
        type:String,
        enum:['faculty','admin'],
        default: 'faculty'
    }
})

module.exports=mongoose.model("user",userSchema)