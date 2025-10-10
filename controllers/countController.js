const user = require("../models/userModel")
const student = require("../models/studentModel")
const report = require("../models/reportModel")
const mongoose = require("mongoose")
const count = async (req,res) => {
    try {
        const userCount = await user.countDocuments()
        const studentCount = await student.countDocuments()
        const reportCount = await report.countDocuments({faculty_id:req.params.fid})
        const totalReportCount = await report.countDocuments()
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
                        from: "students", // Your actual collection name (check MongoDB for correct name)
                        localField: "_id",
                        foreignField: "_id",
                        as: "student"
                      }
                    },
                    {
                      $unwind: "$student"
                    },
                    {
                      $project: {
                        _id: "$student._id",
                        firstName: "$student.firstName",
                        lastName: "$student.lastName",
                        email: "$student.email"
                      }
                    }
                  ]);
        const mystudentCount = uniqueStudents.length
        res.status(200).json({student:studentCount,mystudent:mystudentCount,report:reportCount,totalReportCount:totalReportCount})

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
module.exports={count}