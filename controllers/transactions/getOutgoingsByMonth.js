const { Transaction } = require('../../models')
const { sendSuccessRes, totalAmount } = require('../../helpers')

const getOutgoingsByMonth = async (req, res, next) => {
  const id = res.locals.user.id
  const { year, month } = req.body

  const outgoingsByMonth = await Transaction.find({
    owner: id,
    month,
    year,
    typeOftransactions: false
  }).sort({ amount: -1 })

  const total = totalAmount(outgoingsByMonth)

  sendSuccessRes(res, { month, total, outgoingsByMonth }, 201)
}

module.exports = getOutgoingsByMonth
