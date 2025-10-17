const express = require("express")
const router = express.Router()
const subjectController = require("../controllers/subjectController")
router.post("/subject",subjectController.createSubject)
router.get("/subject",subjectController.getAllSubject)
router.get("/subject/:id",subjectController.getSubjectById)
router.put("/subject/:id",subjectController.updateSubject)
router.delete("/subject/:id",subjectController.deleteSubject)
module.exports=router