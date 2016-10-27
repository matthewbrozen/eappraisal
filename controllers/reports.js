//requirements
var Report = require('../models/report');


//GET all reports
function getAll(req, res, next) {
  Report.find({}, function(err, reports) {
    if (err) throw err;
    res.json({allReports: reports});
  }).select('-_v');
}


//POST one report
function addOne(req, res, next) {
  var report = new Report();
  report.address = req.body.address;
  report.rent = req.body.rent;
  report.total_value = req.body.total_value;
  report.email= req.body.email;
  report.phone = req.body.phone;


  report.save(function(err, report) {
    if (err) throw err;
      res.json(report);
  });
}


// GET one report
function getReport(request, response) {
  var id = request.params.id;

  Report.findById({_id: id}, function(error, report) {
    if(error) response.json({message: 'Could not find report b/c:' + error});

    response.json({report: report});
  });
}


//PATCH to a report
function changeOne(request, response) {
  var id = request.params.id;

  Report.findById({_id:id}, function(error, report) {
    if(error) response.json({message: 'Could not find report b/c:' + error});
    if(request.body.address) report.address = request.body.address ;
    if(request.body.rent) report.rent = request.body.rent;
    if(request.body.total_value) report.total_value= request.body.total_value;
    if(request.body.email) report.email = request.body.email;
    if(request.body.phone) report.phone = request.body.phone;


    report.save(function(error) {
      if(error) response.json({messsage: 'Could not update report b/c:' + error});

      response.json({message: 'Report successfully updated', report: report});
    });
  }).select('-_v');
}

//DELETE a report
function deleteOne(req, res, next) {
  var id = req.params.id;
  console.log(id);
  Report.remove({_id: id}, function(err) {
    if (err) throw err;
    res.json({message: "Report successfully deleted"});
  }).select('-_v');
}

//export functions
module.exports = {
  getAll: getAll,
  addOne: addOne,
  getReport: getReport,
  changeOne: changeOne,
  deleteOne: deleteOne
}
