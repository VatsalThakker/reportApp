const Subject = require("../models/subjectModel")
const createSubject = async (req, res) => {
    try {
        const { subject } = req.body
        req.body['subject']
        const subjectLower = subject.toLowerCase()
        req.body['subject']=subjectLower
        if (!subject || subject.trim() == '') {
            return res.status(400).json({ message: "subject is required" })
        }
        const subjectDetails = await Subject.findOne({ subject })
        if(subjectDetails)
        {
            return res.status(409).json({ message: 'subject is already added '})
        }
        const newSubject = await Subject.create({ subject })
        res.status(201).json({ message: "Subject Created", subject: newSubject })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
const getAllSubject = async (req, res) => {
    try {
        const subjects = await Subject.find()
        res.status(200).json({ data: subjects })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
const getSubjectById = async (req, res) => {
    try {
        const subjectDetails = await Subject.findById(req.params.id)
        if (!subjectDetails) {
            res.status(404).json({ message: "no subject found" })
        }
        res.status(200).json({ data: subjectDetails })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
const deleteSubject = async (req, res) => {
    try {
        const subjectDetails = await Subject.findByIdAndDelete(req.params.id)
        if (!subjectDetails) {
            res.status(404).json({ message: "Subject not found" })
        }
        res.status(200).json({ message: "subject delete successfully", data: subjectDetails })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
const updateSubject = async (req, res) => {
    try {
        const { subject } = req.body
        req.body['subject']=subject.toLowerCase()
        if (!subject || subject.trim() == '') {
            return res.status(400).json({ message: "subject is required" })
        }
        const subjectDetails = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true })

        res.status(200).json({ message: "subject update successfully", data: subjectDetails })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = { createSubject, getAllSubject, getSubjectById, deleteSubject ,updateSubject}