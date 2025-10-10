const cloudinary = require('../config/cloudinaryConfig');
const student = require("../models/studentModel")
const report = require("../models/reportModel")
const bcrypt = require("bcryptjs")
const signup = async (req, res) => {
    try {
        const { firstName, lastName, email, gender, password, batch, collegeName, contactNo,branch } = req.body;
        const existingUser = await student.findOne({ email })

        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" })
        }
        const existingUser1 = await student.findOne({ contactNo })
        if (existingUser1) {
            return res.status(400).json({ message: "contact No already exists" })
        }
        if (!firstName || firstName.trim() === "") {
            return res.status(400).json({ message: "first name is required" })
        }
        if (!lastName || lastName.trim() === "") {
            return res.status(400).json({ message: "lastName is required" })
        }
        if (!email || email.trim() === "") {
            return res.status(400).json({ message: "email is required" })
        }
        if (!gender || gender.trim() === "") {
            return res.status(400).json({ message: "gender is required" })
        }
        if (!password || password.trim() === "") {
            return res.status(400).json({ message: "password is required" })
        }
        if (!batch || batch.trim() === "") {
            return res.status(400).json({ message: "batch is required" })
        }
        if (!collegeName || collegeName.trim() === "") {
            return res.status(400).json({ message: "collegeName is required" })
        }
        if (!contactNo || contactNo.trim() === "") {
            return res.status(400).json({ message: "contactNo is required" })
        }
        if (!branch || branch.trim() === "") {
            return res.status(400).json({ message: "branch is required" })
        }
        let profilePicUrl = null;
        if (req.file && req.file.path) {
          profilePicUrl = req.file.path; // Uploaded to cloudinary by multer-storage-cloudinary
        }
        const newUser = await student.create({
            firstName,
            lastName,
            email,
            gender,
            password: await bcrypt.hash(password, 10),
            batch,
            collegeName,
            contactNo,
            branch,
            profilePicUrl
        })
        newUser.password = undefined
        res.status(201).json({ message: "Student Created successfully", user: newUser })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
const loginByMoblie = async (req, res) => {
    try {
        const { contactNo } = req.body
        const existingUser = await student.findOne({ contactNo })
        if (!existingUser) {
            return res.status(404).json({ message: "Invalid credentials" })
        }
        existingUser.password = undefined;
        res.status(200).json({ message: "Login Successfully", user: { id: existingUser._id, email: existingUser.email, firstName: existingUser.firstName } })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
const search = async (req, res) => {
    try {
        const {name} = req.body;
        const users = await student.find({
            $or: [
                { firstName: { $regex: name, $options: "i" } },
                { lastName: { $regex: name, $options: "i" } }
            ]
        });
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
const getStudentById = async (req, res) => {
    try {
        const studentDetails = await student.find({_id:req.params.id})
        res.status(200).json(studentDetails)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
const getStudentReportBySid = async (req,res) => {
    try {
        
        const studentDetails = await student.find({_id:req.params.id})
        const reportDetails = await report.find({student_id:req.params.id}) .populate({path: 'faculty_id',select: 'firstName lastName email'})
        const subjectCount = reportDetails.length
        const totalPercentage = reportDetails.reduce((sum, r) => sum + (r.per || 0), 0);
        const overallPercentage = subjectCount > 0 ? (totalPercentage / subjectCount).toFixed(2) : 0;

        const getStatus = (overallPercentage) => {
            if (overallPercentage > 75) return "excellent";
            if (overallPercentage > 50) return "very good";
            if (overallPercentage > 25) return "good";
            return "need improvement";
        };

        const sstatus = getStatus(parseFloat(overallPercentage));


        res.status(200).json({studentDetails:studentDetails,reportDetails:reportDetails,subjectCount:subjectCount,overallPercentage:overallPercentage,sstatus:sstatus})
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
const getAllStudent = async (req, res) => {
    try {
        const students = await student.find()
        res.status(200).json({ success: true, count: students.length, data: students })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
const updateStudentPhoto = async (req, res) => {
    try {
      const studentId = req.params.id;
      if (!req.file || !req.file.path) {
        return res.status(400).json({ message: "No photo uploaded" });
      }
      const studentDetails = await student.findById(studentId);
      if (!studentDetails) {
        return res.status(404).json({ message: "Student not found" });
      }
     if (studentDetails.profilePicUrl && studentDetails.profilePicUrl.includes('res.cloudinary.com')) {
        const parts = studentDetails.profilePicUrl.split('/');
        const publicIdWithExtension = parts[parts.length - 1];
        const publicId = `students/${publicIdWithExtension.split('.')[0]}`; // folder + public_id
        await cloudinary.uploader.destroy(publicId); // Remove from Cloudinary
      }
      studentDetails.profilePicUrl = req.file.path;
      await studentDetails.save();
      res.status(200).json({
        message: "Profile photo updated successfully",
        data: studentDetails
      }); 
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
const deleteStudent = async (req, res) => {
    try {
        const studentDetails = await student.findByIdAndDelete(req.params.id)
        if (!studentDetails) {
            res.status(404).json({ message: "Student not Found" })
        }
        res.status(200).json({ message: "Student deleted successfully", data: studentDetails })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
const updateStudent = async (req, res) => {
    try {
        const studentDetails = await student.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (!studentDetails) {
            res.status(404).json({ message: "Student not Found" })
        }
        res.status(200).json({ message: "Student update successfully", data: studentDetails })

    } catch (error) {
        res.status(400).json({ error: err.message });
    }
}
module.exports={signup,updateStudentPhoto,loginByMoblie,getAllStudent,getStudentReportBySid,search,getStudentById,updateStudent,deleteStudent}