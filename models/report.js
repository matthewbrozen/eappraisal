var mongoose = require('mongoose');

var reportSchema = mongoose.Schema({
  address: String,
  rent: Number,
  total_value:Number,
  email:String,
  phone:Number
});

var Report = mongoose.model("Report", reportSchema);
module.exports = Report;
