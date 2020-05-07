'use strict'
const express = require('express')
const http = require('http')
const socketIo = require('socket.io')
const speedTest = require('speedtest-net')
const Data = require('./models/testData')
const mongoose = require('mongoose')
const cron = require('node-cron')
//const routes = require('./routes/index')

mongoose.connect('mongodb://localhost:27017/ispTestData', {
	useNewUrlParser: true,
})

const app = express()
const server = http.createServer(app)
const io = socketIo(server)
//Offline puts more than one entry in db
let outputCount = 0
//app.use('/', routes)
app.use(express.static('public'))
cron.schedule('*/15 * * * *', () => {
	let runDate = new Date()

	console.log('Running Test', runDate.toString())
	const test = speedTest({ maxTime: 5000 })
	// When test results finish, save to db.
	test.on('data', data => {
		if (!outputCount) {
			const constructedData = new Data({ date: runDate, data })
			constructedData.save().then(() => console.log(data))
		}
	})

	test.on('error', err => {
		if (!outputCount) {
			const constructedData = new Data({ date: runDate, data: err })
			constructedData.save().then(() => console.log('Saved'))
			console.log('Offline: ', new Date())
			outputCount++
		}
	})
})

app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'))

io.on('connection', socket => {
	console.log('Client Connected')
	// Aggregate info
	setInterval(async () => {
		const data = {}
		//get last test
		const lastTest = await Data.aggregate([
			{ $sort: { date: -1 } },
			{ $limit: 1 },
			{
				$group: {
					_id: null,
					dl: { $avg: '$data.speeds.download' },
					ul: { $avg: '$data.speeds.upload' },
					ping: { $avg: '$data.server.ping' },
				},
			},
			{ $project: { _id: 0, dl: 1, ul: 1, ping: 1 } },
		])
		data.lastTest = lastTest[0]
		// get last hour
		const lastHour = await Data.aggregate([
			{ $sort: { date: -1 } },
			{ $limit: 4 },
			{
				$group: {
					_id: null,
					dl: { $avg: '$data.speeds.download' },
					ul: { $avg: '$data.speeds.upload' },
					ping: { $avg: '$data.server.ping' },
				},
			},
			{
				$project: {
					_id: 0,
					dl: { $round: ['$dl', 3] },
					ul: { $round: ['$ul', 3] },
					ping: { $round: ['$ping', 1] },
				},
			},
		])
		data.lastHour = lastHour[0]

		//get last day
		const lastDay = await Data.aggregate([
			{ $sort: { date: -1 } },
			{ $limit: 96 },
			{
				$group: {
					_id: null,
					dl: { $avg: '$data.speeds.download' },
					ul: { $avg: '$data.speeds.upload' },
					ping: { $avg: '$data.server.ping' },
				},
			},
			{
				$project: {
					_id: 0,
					dl: { $round: ['$dl', 3] },
					ul: { $round: ['$ul', 3] },
					ping: { $round: ['$ping', 1] },
				},
			},
		])
		data.lastDay = lastDay[0]

		//get last week

		const lastWeek = await Data.aggregate([
			{ $sort: { date: -1 } },
			{ $limit: 672 },
			{
				$group: {
					_id: null,
					dl: { $avg: '$data.speeds.download' },
					ul: { $avg: '$data.speeds.upload' },
					ping: { $avg: '$data.server.ping' },
				},
			},
			{
				$project: {
					_id: 0,
					dl: { $round: ['$dl', 3] },
					ul: { $round: ['$ul', 3] },
					ping: { $round: ['$ping', 1] },
				},
			},
		])
		data.lastWeek = lastWeek[0]
		socket.emit('data', data)
	}, 10000)
	socket.on('disconnect', () => console.log('Disconnected'))
})

const port = 5000
server.listen(port, () => console.log('Webserver listening on ', port))
