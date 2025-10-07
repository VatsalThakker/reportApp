const express = require("express")
const router = express.Router()
const countController = require("../controllers/countController")
router.get("/count/:fid",countController.count)
module.exports=router