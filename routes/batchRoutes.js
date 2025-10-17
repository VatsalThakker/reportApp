const express = require("express")
const router = express.Router()
const batchController = require("../controllers/batchController")
router.post("/batch",batchController.createBatch)
router.get("/batch",batchController.getAllbatch)
router.get("/batch/:id",batchController.getAllbatch)
router.put("/batch/:id",batchController.updateBatch)
router.delete("/batch/:id",batchController.deleteBatch)
module.exports=router