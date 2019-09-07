var mongoose = require('mongoose')

var testData = new mongoose.Schema({
	date: { type: String, default: Date.now },
	data: Object

})

var Data = mongoose.model('dataSet', testData)
module.exports = Data 