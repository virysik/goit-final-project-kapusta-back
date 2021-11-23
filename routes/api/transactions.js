const express = require('express')
const router = express.Router()

const {
  transactionJoiSchema
} = require('../../models/transaction')
const { validation, ctrlWrap } = require('../../middlewares')

const controllers = require('../../controllers/transactions')
const guard = require('../../helpers/guard')

router.get('/', guard, ctrlWrap(controllers.detailedInformation))
router.post(
  '/incomings',
  guard,
  validation(transactionJoiSchema),
  ctrlWrap(controllers.incomeings)
)
router.post(
  '/outgoings',
  guard,
  validation(transactionJoiSchema),
  ctrlWrap(controllers.outgoings)
)

router.delete(
  '/:transactionId',
  guard,
  ctrlWrap(controllers.removeTransactionById)
)

router.get('/incomings', guard, ctrlWrap(controllers.incomingsSummaryForYear))
router.get('/outgoings', guard, ctrlWrap(controllers.outgoingsSummaryForYear))

router.get(
  '/incomings/date',
  guard,
  ctrlWrap(controllers.getAllIncomingsByPeriod)
)

router.get(
  '/outgoings/date',
  guard,
  ctrlWrap(controllers.getAllOutgoingsByPeriod)
)

router.get('/forReports', guard, ctrlWrap(controllers.getInfoForReports))

module.exports = router
