'use strict'
const express = require('express')
const http = require('http')
const socketIo = require('socket.io')
const speedTest = require('speedtest-net')
const Data = require('./models/testData')
const mongoose = require('mongoose')
const cron = require('node-cron')
// Connect to DB.
mongoose.connect('mongodb://localhost:27017/ispTestData', {
	useNewUrlParser: true,
})
// Set Up express for delivery of public files.
const app = express()
const server = http.createServer(app)
// Setup for SocketIO. Allows for real-time communication to front-end.
const io = socketIo(server)

// Setup routes
app.use(express.static('public'))
app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'))

//Offline puts more than one entry in db
let outputCount = 0

// Setup Cron Jobs
cron.schedule('*/15 * * * *', () => {
	let runDate = new Date()

	console.log('Running Test', runDate.toString())
	const test = speedTest({
		maxTime: 5000,
		acceptLicense: true,
		acceptGdpr: true,
		host: 'speedtest-avl-public.bloomip.com:8080',
		serverId: '14480',
	})
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

/* Communication to Front-End via SocketIO
 * Function's job to aggegate information then send data every 10 seconds.
 */
io.on('connection', socket => {
	console.log('Client Connected')
	// Aggregate info
	setInterval(async () => {
		const data = {}
		/*
		 *
		 * This section is the queries to get data to send.
		 * Its basically rinse and repeat. Sort new data to the top of the return,
		 * grab the number of tests that you need. Then, group, average, and round as
		 * necessary. Using the project step to remove the _id as it is not needed.
		 *
		 * */
		//get last test
		const lastTest = await Data.aggregate([
			{ $sort: { date: -1 } },
			{ $limit: 1 },
			{
				$project: {
					_id: 0,
					dl: '$data.speeds.download',
					ul: '$data.speeds.upload',
					ping: '$data.server.ping',
				},
			},
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
