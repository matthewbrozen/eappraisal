//  requirements
var Report = require('../models/report')
var nodemailer = require('nodemailer')
var dotenv = require('dotenv')

require('dotenv').load();

// Credentials
var accountSid = (process.env.accountSid)
var authToken = (process.env.authToken)
var twilnum = (process.env.twilnum)
var emailsetup = (process.env.emailsetup)
var emailcred= (process.env.emailcred)
var emailsend= (process.env.emailsend)


// require the Twilio module and create a REST client
var client = require('twilio')(accountSid, authToken)




// POST one report
function addOne (req, res, next) {

  Number.prototype.formatMoney = function(c, d, t){
  var n = this,
      c = isNaN(c = Math.abs(c)) ? 2 : c,
      d = d == undefined ? "." : d,
      t = t == undefined ? "," : t,
      s = n < 0 ? "-" : "",
      i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
      j = (j = i.length) > 3 ? j % 3 : 0;
     return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
   };



  var report = new Report()
  report.email = req.body.email
  report.address = req.body.address
  report.gross_rent = req.body.gross_rent
  report.agent = req.body.agent
  report.phone = req.body.phone

  var egg = ((((report.gross_rent * 12) * 0.65) / 0.04) * 0.7)

  report.save()
  .then(client.messages.create({
    to: report.phone,
    from: twilnum,
    body: 'Hey! This is ValueEgg. Your cash offer is $' + egg.formatMoney() + '. Please call 213-216-3754 with this code '+ Math.floor(Math.random()*666+100) +' if you want to sell NOW!'
  }, function (err, message) {
    if (err) {
      console.log('error')
    }
  }))
  .then(function (newReport) {
    // nodemailer set up on report save
    var sendMailTo = function (req, res, next) {
      var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: emailsetup,
          pass: emailcred
        }
      })

      var mailOptions = {
        from: 'Interested Seller <'+emailsetup+'>',
        to: emailsend,
        subject: 'ValueEgg Seller for '+ newReport.address,
        text: 'You have a client interested in selling their property... Order: ' + ' Rent is:  ' + newReport.gross_rent + ',    Address is:   ' + newReport.address + ',    Email is:    ' + newReport.email + newReport.agent + ', Phone number is: ' + newReport.phone + ', Agent selected is: ' + newReport.agent,
        html: '<p>you have a client interested in selling their property with the following details...</p>' + ' Rent is:  ' + newReport.gross_rent + ',    Address is:   ' + newReport.address + ',    Email is:    ' + newReport.email + ', Phone number is: ' + newReport.phone + ', Agent selected is: ' + newReport.agent
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

// export functions
module.exports = {
  addOne: addOne
}
