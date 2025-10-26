const report = require("../models/reportModel")
const mongoose = require("mongoose")
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
        if (!discipline || discipline == null) {
            return res.status(400).json({ message: "discipline is required" })
        }
        if (!regularity || regularity == null) {
            return res.status(400).json({ message: "regularity is required" })
        }
        if (!communication || communication == null) {
            return res.status(400).json({ message: "communication is required" })
        }
        if (!test || test == null) {
            return res.status(400).json({ message: "test is required" })
        }
        let tmpSubj = subject.toLowerCase();
        req.body["subject"] = tmpSubj
        const existingReport = await report.findOne({
            student_id,
            faculty_id,
            subject
        });
        if (existingReport) {
            return res.status(409).json({
                message: `Report for subject '${subject}' already exists for this student and faculty.`
            });
        }
        let total = parseInt(discipline) + parseInt(regularity) + parseInt(communication) + parseInt(test)
        let per = (total / 20) * 100
        let sstatus = ""
        if (per > 75) sstatus = "excellent";
        else if (per > 50) sstatus = "very good";
        else if (per > 25) sstatus = "good";
        else if (per > 0) sstatus = "need improvement";
        else sstatus = "average";
        req.body["total"] = total
        req.body["per"] = per
        req.body["sstatus"] = sstatus

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
            }).populate({path:'subject'})

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
        const { discipline, regularity, communication, test } = req.body;

        // Fetch the existing report first
        const existingReport = await report.findById(req.params.id);
        if (!existingReport) {
            return res.status(404).json({ message: "Report not found" });
        }

        // If scoring fields are being updated, recalculate derived values
        const shouldRecalculate = [discipline, regularity, communication, test].some(field => field !== undefined);

        if (shouldRecalculate) {
            const toNumber = (val) => Number(val) || 0;

            const newDiscipline = discipline !== undefined ? toNumber(discipline) : toNumber(existingReport.discipline);
            const newRegularity = regularity !== undefined ? toNumber(regularity) : toNumber(existingReport.regularity);
            const newCommunication = communication !== undefined ? toNumber(communication) : toNumber(existingReport.communication);
            const newTest = test !== undefined ? toNumber(test) : toNumber(existingReport.test);

            const total = newDiscipline + newRegularity + newCommunication + newTest;
            const per = (total / 20) * 100;

            const getStatus = (per) => {
                if (per > 75) return "excellent";
                if (per > 50) return "very good";
                if (per > 25) return "good";
                return "need improvement";
            };

            const sstatus = getStatus(per);

            // Add calculated fields to req.body to update
            req.body.total = total;
            req.body.per = per;
            req.body.sstatus = sstatus;
        }

        // Update the report
        const updatedReport = await report.findByIdAndUpdate(req.params.id, req.body, { new: true });

        res.status(200).json({
            message: "Report updated successfully",
            data: updatedReport
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const reportByFacultyId = async (req, res) => {
    try {
        const uniqueStudents = await report.aggregate([
            {
                $match: {
                    faculty_id: new mongoose.Types.ObjectId(req.params.fid)
                }
            },
            {
                $group: {
                    _id: "$student_id"
                }
            },
            {
                $lookup: {
                    from: "students", // Make sure this is the actual collection name in MongoDB
                    localField: "_id",
                    foreignField: "_id",
                    as: "student"
                }
            },
            {
                $unwind: "$student"
            },
            {
                $sort: {
                    "student.createdAt": -1 // ✅ Sort by student's createdAt (descending)
                }
            },
            {
                $project: {
                    _id: "$student._id",
                    firstName: "$student.firstName",
                    lastName: "$student.lastName",
                    email: "$student.email",
                    gender: "$student.gender",
                    batch: "$student.batch",
                    collegeName: "$student.collegeName",
                    branch: "$student.branch",
                    contactNo: "$student.contactNo",
                    profilePicUrl: "$student.profilePicUrl",
                    createdAt: "$student.createdAt"
                }
            }
        ]);

        res.status(200).json({ data: uniqueStudents });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createReport, reportByFacultyId, readAllReport, readReportBySid, readReportById, updateReport, deleteReport }
