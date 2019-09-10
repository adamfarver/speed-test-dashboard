var mongoose = require('mongoose')

var testData = new mongoose.Schema({
	date: { type: Number, default: Date.now },
	data: Object

})

var Data = mongoose.model('dataSet', testData)
module.exports = Data 