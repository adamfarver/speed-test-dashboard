const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const model = require("../models/testData")


//view results
router.get("/", async function (req, res, next) {
	const data = await model.find({ "data.speeds.download": { $gt: 10 } })
	console.log(data)
	res.send(data)
})





module.exports = router


