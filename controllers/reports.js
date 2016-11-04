//  requirements
var Report = require('../models/report')
var nodemailer = require('nodemailer')


// Twilio Credentials
var accountSid = 'AC9eb5b40ff90b70c3b03de0caaaa8cb72';
var authToken = '15a80220b318334bddd72eae2d942383';

//require the Twilio module and create a REST client
var client = require('twilio')(accountSid, authToken);


// GET all reports
function getAll (req, res, next) {
  Report.find({}, function (err, reports) {
    if (err) throw err
    res.json({allReports: reports})
  }).select('-_v')
}

// POST one report
function addOne (req, res, next) {
  var report = new Report()
  report.email = req.body.email
  report.address = req.body.address
  report.gross_rent = req.body.gross_rent
  report.agent = req.body.agent
  report.phone = req.body.phone

  var egg = (((report.gross_rent * 12)*.65)/.04);

  report.save()
  .then(client.messages.create({
      to: report.phone,
      from: "+17633163360",
      body: "Your Cash Offer is " + egg + " Call hot line 612-889-3535 with this code 1234 if interested",
  }, function(err, message) {
      console.log(message.sid);
  }))
  .then(function (newReport) {
    // nodemailer set up on report save
    var sendMailTo = function (req, res, next) {
      var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'propertyeappraisal@gmail.com',
          pass: '540nrossmore'
        }
      })

      var mailOptions = {
        from: 'Interested Seller <propertyeappraisal@gmail.com>',
        to: 'propertyeappraisal@gmail.com',
        subject: 'You have a client interested in selling their property',
        text: 'You have a client interested in selling their property... Order: ' + " Rent is:  " + newReport.gross_rent + ",    Address is:   " + newReport.address + ",    Email is:    " + newReport.email + newReport.agent + ", Phone number is: " + newReport.phone + ", Agent selected is: " + newReport.agent,
        html: '<p>you have a client interested in selling their property with the following details...</p>' + " Rent is:  " + newReport.gross_rent + ",    Address is:   " + newReport.address + ",    Email is:    " + newReport.email + ", Phone number is: " + newReport.phone+ ", Agent selected is: " + newReport.agent
      }
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error)
        } else {
          console.log('Message Sent: ' + info.response)
        }
      })
    }
    res.json(newReport)
    sendMailTo()
  })
      .catch(function (err) {
        if (err.message.match(/E11000/)) {
          err.status = 409
        } else {
          err.status = 422
        }
        next(err)
      })
}

// GET one report
function getReport (request, response) {
  var id = request.params.id

  Report.findById({_id: id}, function (error, report) {
    if (error) response.json({message: 'Could not find report b/c:' + error})

    response.json({report: report})
  })
}

// PATCH to a report
function changeOne (request, response) {
  var id = request.params.id

  Report.findById({_id: id}, function (error, report) {
    if (error) response.json({message: 'Could not find report b/c:' + error})
    if (request.body.email) report.email = request.body.email
    if (request.body.address) report.address = request.body.address
    if (request.body.gross_rent) report.gross_rent = request.body.gross_rent
    if (request.body.agent) report.agent = request.body.agent
    if (request.body.phone) report.phone = request.body.phone

    report.save(function (error) {
      if (error) response.json({messsage: 'Could not update report b/c:' + error})

      response.json({message: 'Report successfully updated', report: report})
    })
  }).select('-_v')
}

// DELETE a report
function deleteOne (req, res, next) {
  var id = req.params.id
  console.log(id)
  Report.remove({_id: id}, function (err) {
    if (err) throw err
    res.json({message: 'Report successfully deleted'})
  }).select('-_v')
}

// export functions
module.exports = {
  getAll: getAll,
  addOne: addOne,
  getReport: getReport,
  changeOne: changeOne,
  deleteOne: deleteOne
}
