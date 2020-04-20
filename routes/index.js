/**
 * @format
 */
'use strict'
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const model = require('../models/testData')

router.get('/', async (req, res) => {
	const data = {}
	//get last test
	const lastTest = await model.aggregate([
		{ $sort: { date: -1 } },
		{ $limit: 1 },
		{
			$group: {
				_id: null,
				DL: { $avg: '$data.speeds.download' },
				UL: { $avg: '$data.speeds.upload' },
				ping: { $avg: '$data.server.ping' },
			},
		},
		{ $project: { _id: 0, DL: 1, UL: 1, ping: 1 } },
	])
	data.lastTest = lastTest[0]
	// get last hour
	const lastHour = await model.aggregate([
		{ $sort: { date: -1 } },
		{ $limit: 4 },
		{
			$group: {
				_id: null,
				averageDL: { $avg: '$data.speeds.download' },
				averageUL: { $avg: '$data.speeds.upload' },
				averagePing: { $avg: '$data.server.ping' },
			},
		},
		{ $project: { _id: 0, averageDL: 1, averageUL: 1, averagePing: 1 } },
	])
	data.lastHour = lastHour[0]

	//get last day
	const lastDay = await model.aggregate([
		{ $sort: { date: -1 } },
		{ $limit: 96 },
		{
			$group: {
				_id: null,
				averageDL: { $avg: '$data.speeds.download' },
				averageUL: { $avg: '$data.speeds.upload' },
				averagePing: { $avg: '$data.server.ping' },
			},
		},
		{ $project: { _id: 0, averageDL: 1, averageUL: 1, averagePing: 1 } },
	])
	data.lastDay = lastDay[0]

	//get last week

	const lastWeek = await model.aggregate([
		{ $sort: { date: -1 } },
		{ $limit: 672 },
		{
			$group: {
				_id: null,
				averageDL: { $avg: '$data.speeds.download' },
				averageUL: { $avg: '$data.speeds.upload' },
				averagePing: { $avg: '$data.server.ping' },
			},
		},
		{ $project: { _id: 0, averageDL: 1, averageUL: 1, averagePing: 1 } },
	])
	data.lastWeek = lastWeek[0]

	res.send(data)
})

module.exports = router
