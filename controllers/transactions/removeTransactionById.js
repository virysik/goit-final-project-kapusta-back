const { sendSuccessRes } = require('../../helpers')
const { Transaction, User } = require('../../models')

const removeTransactionById = async (req, res) => {
  const id = req.params.transactionId
  const result = await Transaction.findByIdAndDelete(id)
  const userId = res.locals.user._id

  if (!result) {
    res.status(404).json({
      status: 'error',
      code: 404,
      message: `Transaction with id:${req.params.transactionId} not found`,
    })
    return
  }
  const newBalance = result.typeOftransactions
    ? res.locals.user.balance - result.amount
    : res.locals.user.balance + result.amount
  await User.findByIdAndUpdate(userId, { balance: newBalance }, { new: true })

  sendSuccessRes(res, { message: 'Transaction deleted' })
}

module.exports = removeTransactionById
