const mongoose = require('mongoose')
const studentSchema = new mongoose.Schema({
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
    branch:{
        type: String,
        required: true,
        enum:['ahmedabad','gandhinagar','himmatnagar']
    },
    batch: {
        type: String,
        required: true
    },
    collegeName: {
        type: String,
        required: true
    },
    contactNo: {
        type: String,
        required: true,
        minlength:10
    },
    profilePicUrl:{
        type:String,
        default:""
    } ,createdAt: {
        type: Date,
        default: Date.now
    }
    
})
module.exports=mongoose.model("student",studentSchema)

//fix 