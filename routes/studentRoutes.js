const express = require("express")
const router = express.Router()
const studentController = require("../controllers/studentController")
const upload = require('../upload'); // adjust path if needed
router.post("/signup", upload.single('profilePic'),studentController.signup)
router.get("/student",studentController.getAllStudent)
router.get("/student/:id",studentController.getStudentById)
router.delete("/student/:id",studentController.deleteStudent)
router.put("/student/:id",studentController.updateStudent)
router.post("/search",studentController.search)
router.get("/sreport/:id",studentController.getStudentReportBySid)
router.post("/studentlogin",studentController.loginByMoblie)
module.exports=router