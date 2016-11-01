//  requirements
var Report = require('../models/report')
var nodemailer = require('nodemailer')

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

  report.save()
  .then(function (newProperty) {
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
        from: 'TESTING <matthewbrozen@gmail.com>',
        to: 'propertyeappraisal@gmail.com',
        subject: 'You have a client interested in selling their property',
        text: 'You have an order with the following details... Order: ' + newProperty,
        html: '<p>You have an order with the following details...</p>' + newProperty
      }

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error)
        } else {
          console.log('Message Sent: ' + info.response)
        }
      })
    }
    res.json(newProperty)
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
