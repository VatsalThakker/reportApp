const report = require("../models/reportModel")
const createReport = async (req, res) => {
    try {
        const { student_id, faculty_id, subject, discipline, regularity, communication, test } = req.body
        if (!student_id || student_id.trim() === "") {
            return res.status(400).json({ message: "student_id is required" })
        }
        if (!faculty_id || faculty_id.trim() === "") {
            return res.status(400).json({ message: "faculty_id is required" })
        }
        if (!subject || subject.trim() === "") {
            return res.status(400).json({ message: "subject is required" })
        }
        if (!discipline || discipline.trim() === "") {
            return res.status(400).json({ message: "discipline is required" })
        }
        if (!regularity || regularity.trim() === "") {
            return res.status(400).json({ message: "regularity is required" })
        }
        if (!communication || communication.trim() === "") {
            return res.status(400).json({ message: "communication is required" })
        }
        if (!test || test.trim() === "") {
            return res.status(400).json({ message: "test is required" })
        }
        const reportDetails = await report.create(req.body)
        res.status(201).json({ message: "Report Created successfully", data: reportDetails })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const readAllReport = async (req, res) => {
    try {
        const reports = await report.find()
        res.status(200).json({ data: reports })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
const readReportBySid = async (req, res) => {
    try {
        console.log(req.params.sid)
        const reports = await report.find({ student_id: req.params.sid })
        res.status(200).json({ data: reports })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const readReportById = async (req, res) => {
    try {
        const reports = await report.find({_id:req.params.id})
        res.status(200).json({ data: reports })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
const deleteReport = async (req, res) => {
    try {
        const reportDetails = await report.findByIdAndDelete(req.params.id)
        if (!reportDetails) {
            res.status(404).json({ message: "Report not Found" })
        }
        res.status(200).json({ message: "Report deleted successfully", data: reportDetails })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
const updateReport = async (req, res) => {
    try {
        const reportDetails = await report.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (!reportDetails) {
            res.status(404).json({ message: "Report not Found" })
        }
        res.status(200).json({ message: "Report update successfully", data: reportDetails })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
const reportByFacultyId = async (req,res) => {
    try {
        const reports = await report.find({ faculty_id: req.params.fid }).populate("student_id")
        
        res.status(200).json({ data: reports })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
module.exports = { createReport,reportByFacultyId, readAllReport, readReportBySid, readReportById, updateReport, deleteReport }