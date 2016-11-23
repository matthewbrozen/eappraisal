var mongoose = require('mongoose')

var emailSchema = mongoose.Schema({
  email: String,
  address: String,
  gross_rent: Number
})

var Email = mongoose.model('Email', emailSchema)
module.exports = Email
