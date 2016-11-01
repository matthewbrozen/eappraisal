var mongoose = require('mongoose')

var reportSchema = mongoose.Schema({
  email: String,
  address: String,
  gross_rent: Number
})

var Report = mongoose.model('Report', reportSchema)
module.exports = Report
