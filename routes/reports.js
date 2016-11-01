// express router
var express = require('express')
var router = express.Router()

// requirements
var reportsController = require('../controllers/reports')

// cors header
router.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PATCH,POST,DELETE')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

// GET all  reports
router.get('/', reportsController.getAll)
// POST one report
router.post('/', reportsController.addOne)
// GET one report
router.get('/:id', reportsController.getReport)
// POST to a report
router.patch('/:id', reportsController.changeOne)
// DELETE a report
router.delete('/:id', reportsController.deleteOne)

// export router
module.exports = router
