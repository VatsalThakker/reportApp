const batch = require("../models/batchModel")
const createBatch = async (req, res) => {
    try {
        const { batchName } = req.body
        if (!batchName || batchName.trim() == '') {
            return res.status(400).json({ message: "batch is required" })
        }
        const batchDetails = await batch.findOne({batchName})
        if(batchDetails)
        {
            return res.status(409).json({ message: 'Batch is already added '})
        }
        const newBatch = await batch.create({ batchName })
        res.status(201).json({ message: "batch Created", batch: newBatch })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
const getAllbatch = async (req, res) => {
    try {
        const batches = await batch.find()
        res.status(200).json({ data: batches })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
const getbatchById = async (req, res) => {
    try {
        const batchDetails = await batch.findById(req.params.id)
        if (!batchDetails) {
            res.status(404).json({ message: "batch not found" })
        }
        res.status(200).json({ data: batchDetails })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
const deleteBatch = async (req, res) => {
    try {
        const batchDetails = await batch.findByIdAndDelete(req.params.id)
        if (!batchDetails) {
            res.status(404).json({ message: "batch not found" })
        }
        res.status(200).json({ message: "batch delete successfully", data: batchDetails })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
const updateBatch = async (req, res) => {
    try {
        const { batchName } = req.body
        if (!batchName || batchName.trim() == '') {
            return res.status(400).json({ message: "batch is required" })
        }
        const batchDetails = await batch.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.status(200).json({ message: "batch update successfully", data: batchDetails })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = { createBatch, getAllbatch, getbatchById, deleteBatch ,updateBatch}