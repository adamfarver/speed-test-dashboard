'use strict'
const express = require("express")
const speedTest = require("speedtest-net");
const Data = require("./models/testData")
const mongoose = require('mongoose')
const cron = require("node-cron")
const routes = require("./routes/index")

mongoose.connect('mongodb://localhost:27017/ispTestData', { useNewUrlParser: true });

const app = express();
//Offline puts more than one entry in db
let outputCount = 0
app.use("/", routes)
cron.schedule('*/15 * * * *', () => {
  let runDate = new Date()

  console.log("Running Test", runDate.toString())
  const test = speedTest({ maxTime: 5000 });
  // When test results finish, save to db.
  test.on("data", data => {
    if (!outputCount) {
      const constructedData = new Data({ date: runDate, data });
      constructedData.save().then(() => console.log(data))

    }
  });

  test.on("error", err => {
    if (!outputCount) {
      const constructedData = new Data({ date: runDate, data: err });
      constructedData.save().then(() => console.log("Saved"))
      console.log("Offline: ", new Date());
      outputCount++
    }
  });


});

const port = 5000
app.listen(port, () => console.log("Webserver listening on ", port))

