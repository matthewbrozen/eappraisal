var mongoose = require('mongoose');

var reportSchema = mongoose.Schema({
  email     : String,
  phone     : String,
  address1   : String,
  address2   : String,
  address   : String,
  zip_code  : Number,
  city      : String,
  state     : String,
  gross_rent: Number
});

var Report = mongoose.model("Report", reportSchema);
module.exports = Report;
