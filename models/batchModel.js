const mongoose = require("mongoose")
const batchSchema = new mongoose.Schema({
    batchName: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }
})
module.exports =mongoose.model('batch',batchSchema)
