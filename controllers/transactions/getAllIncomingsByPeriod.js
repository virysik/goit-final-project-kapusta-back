const { Transaction } = require('../../models')
const { sendSuccessRes } = require('../../helpers')
const { BadRequest } = require('http-errors')

const getAllOutgoingsByParams = async (req, res, next) => {
  const id = res.locals.user.id

  if (!req.query.year) {
    throw new BadRequest('Year is required')
  }

  const allOutgoingsByParams = await Transaction.find({
    owner: id,
    ...req.query,
    typeOftransactions: true
  }).sort({ amount: -1 })

  sendSuccessRes(res, allOutgoingsByParams, 200)
}

module.exports = getAllOutgoingsByParams
