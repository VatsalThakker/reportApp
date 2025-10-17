const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }
});

module.exports = mongoose.model('subject', subjectSchema);
