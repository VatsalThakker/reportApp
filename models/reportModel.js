const mongoose = require('mongoose')
const reportSchema = new mongoose.Schema({
    student_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student'
    },
    faculty_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    subject:{
        type:String,
        required: true
    },
    discipline:{
        type:Number,
        required: true,
        min:0,
        max:5
    },
    regularity:{
        type:Number,
        required: true,
        min:0,
        max:5
    },
    communication:{
        type:Number,
        required: true,
        min:0,
        max:5
    },
    test:{
        type:Number,
        required: true,
        min:0,
        max:5
    },
    total:{
        type:Number,
        min:0,
        max:20
    },
    per :{
        type:Number,
        min:0,
        max:100
    },
    sstatus:{
        type:String,
        enum:['excellent','very good','good','need improvement','average']
    }
})

module.exports=mongoose.model("report",reportSchema)