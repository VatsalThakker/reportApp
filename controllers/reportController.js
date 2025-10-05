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
        if (!discipline ) {
            return res.status(400).json({ message: "discipline is required" })
        }
        if (!regularity ) {
            return res.status(400).json({ message: "regularity is required" })
        }
        if (!communication ) {
            return res.status(400).json({ message: "communication is required" })
        }
        if (!test ) {
            return res.status(400).json({ message: "test is required" })
        }
        let tmpSubj = subject.toLowerCase();
        const existingReport = await report.findOne({
            student_id,
            faculty_id,
            subject: tmpSubj
        });
        if (existingReport) {
            return res.status(409).json({
                message: `Report for subject '${subject}' already exists for this student and faculty.`
            });
        }
        let total = parseInt(discipline) + parseInt(regularity) + parseInt(communication) + parseInt(test)
        let per = (total / 20) * 100
        let sstatus=""
        if (per <= 100 && per>75) {
            sstatus = "excellent"
        } else if (per <= 75 && per > 50) {
            sstatus = "very good"
        } else if (per <= 50 && per > 25) {
            sstatus = "good"
        } else if (per <= 25 && per > 0 ){
            sstatus = "need improvement"
        }
        req.body["total"]=total 
        req.body["per"]=per 
        req.body["sstatus"]=sstatus
        req.body["subject"]=tmpSubj
        const reportDetails = await report.create(req.body)
        res.status(201).json({ message: "Report Created successfully", data: reportDetails })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const readAllReport = async (req, res) => {
    try {
      const reports = await report.find()
        .populate({
          path: 'student_id',
          select: 'firstName lastName email'
        })
        .populate({
            path: 'faculty_id',
            select: 'firstName lastName email' 
          })
  
      res.status(200).json({ data: reports });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
const readReportBySid = async (req, res) => {
    try {
        console.log(req.params.sid)
        const reports = await report.find({ student_id: req.params.sid }) 
        .populate({
            path: 'student_id',
            select: 'firstName lastName email'
          })
          .populate({
              path: 'faculty_id',
              select: 'firstName lastName email'
            })
        res.status(200).json({ data: reports })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const readReportById = async (req, res) => {
    try {
        const reports = await report.find({ _id: req.params.id }) 
        .populate({
            path: 'student_id',
            select: 'firstName lastName email'
          })
          .populate({
              path: 'faculty_id',
              select: 'firstName lastName email'
            })
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
const reportByFacultyId = async (req, res) => {
    try {
        const reports = await report.find({ faculty_id: req.params.fid }).populate("student_id") .populate({
            path: 'student_id',
            select: 'firstName lastName email'
          })
          .populate({
              path: 'faculty_id',
              select: 'firstName lastName email' // You can add more fields if needed
            })

        res.status(200).json({ data: reports })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
module.exports = { createReport, reportByFacultyId, readAllReport, readReportBySid, readReportById, updateReport, deleteReport }