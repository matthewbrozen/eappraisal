//  requirements
var Email = require('../models/email')
var nodemailer = require('nodemailer')
var dotenv = require('dotenv')

require('dotenv').load();

// Credentials
var emailsetup = (process.env.emailsetup)
var emailcred= (process.env.emailcred)
var emailsend= (process.env.emailsend)

// POST one email
function sendOne (req, res, next) {

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



  var email = new Email()
  email.email = req.body.email
  email.address = req.body.address
  email.gross_rent = req.body.gross_rent

  var egg = ((((email.gross_rent * 12) * 0.65) / 0.04) * 0.7)
  var upper =((((email.gross_rent * 12) * 0.65) / 0.04) * 1.1)
  var lower = ((((email.gross_rent * 12) * 0.65) / 0.04) * 0.9)
  var list = (((email.gross_rent * 12) * 0.65) / 0.04)


  email.save()
  .then(function (newEmail) {
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
        from: 'ValueEgg.com <'+emailsetup+'>',
        to: newEmail.email,
        subject: 'ValueEgg - Exact list price for ' + newEmail.address,
        text: ' Thanks for visiting ValueEgg.com. We believe your property ' + newEmail.address + ' should be listed for $' + upper.formatMoney() + ' to $' + lower.formatMoney() + ". If you're interested in selling, list your property for $" + list.formatMoney() + ' with the top apartment broker in the area, David Bramante, find out more by calling 213-375-3752 or visit www.breinvestment.com. Hope that helps! ValueEgg.com',
        html: ' Thanks for visiting ValueEgg.com. We believe your property ' + newEmail.address + ' should be listed for $' + upper.formatMoney() + ' to $' + lower.formatMoney() + ". If you're interested in selling, list your property for $" + list.formatMoney() + ' with the top apartment broker in the area, David Bramante, find out more by calling 213-375-3752 or visit www.breinvestment.com. <br><br><small> Hope that helps! ValueEgg.com</small>',
      }
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error)
        } else {
          console.log('Message Sent: ' + info.response)
        }
      })
    }
    res.json(newEmail)
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
  sendOne: sendOne
}
