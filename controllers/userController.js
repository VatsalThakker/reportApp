const user = require("../models/userModel")
const report = require("../models/reportModel")
const bcrypt = require("bcryptjs");
const signup = async (req, res) => {
    try {
        const { firstName, lastName, email, gender, password, contactNo, role } = req.body;
        const existingUser = await user.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" })
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
        if (!contactNo || contactNo.trim() === "") {
            return res.status(400).json({ message: "contactNo is required" })
        }
        if (!role || role.trim() === "") {
            return res.status(400).json({ message: "role is required" })
        }
        if (!password || password.trim() === "") {
            return res.status(400).json({ message: "password is required" })
        }
        const newUser = await user.create({
            firstName,
            lastName,
            email,
            gender,
            password: await bcrypt.hash(password, 10),
            contactNo,
            role
        })
        newUser.password = undefined
        res.status(201).json({ message: "User Created successfully", user: newUser })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const existingUser = await user.findOne({ email })
        if (!existingUser) {
            return res.status(404).json({ message: "Invalid credentials" })
        }
        const isMatch = await bcrypt.compare(password, existingUser.password)
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" })
        }
        existingUser.password = undefined;
        res.status(200).json({ message: "Login Successfully", user: { id: existingUser._id, email: existingUser.email, firstName: existingUser.firstName } })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
const updateFaculty = async (req, res) => {
    try {
        const facultyDetails = await user.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (!facultyDetails) {
            res.status(404).json({ message: "Faculty not Found" })
        }
        res.status(200).json({ message: "Faculty update successfully", data: facultyDetails })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
const getUserById=async (req,res) => {
    try {
        const facultyDetails = await student.find({_id:req.params.id})
        res.status(200).json(facultyDetails)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
const deleteFaculty = async (req, res) => {
    try {
            const facultyDetails = await user.findByIdAndDelete(req.params.id)
            if (!facultyDetails) {
                res.status(404).json({ message: "Faculty not Found" })
            }
            res.status(200).json({ message: "Faculty deleted successfully", data: facultyDetails })
        } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await user.find().select("-password")
        res.status(200).json({ success: true, count: users.length, data: users })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const getAllAdmin = async (req, res) => {
    try {
        const admins = await user.find({ role: "admin" }).select("-password")
        res.status(200).json({ success: true, count: admins.length, data: admins })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getAllFaculty = async (req, res) => {
    try {
        const faculty = await user.find({ role: "faculty" }).select("-password")
        res.status(200).json({ success: true, count: faculty.length, data: faculty })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
module.exports = { signup,getUserById, login, getAllUsers, getAllAdmin, getAllFaculty, updateFaculty, deleteFaculty }