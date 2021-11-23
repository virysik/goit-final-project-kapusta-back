const { sendSuccessRes } = require('../../helpers')
const { Transaction, User } = require('../../models')

const incoming = async (req, res) => {
  const id = res.locals.user._id
  const newIncoming = { ...req.body, owner: id, typeOftransactions: true }
  const result = await Transaction.create(newIncoming)

  const newBalance = res.locals.user.balance + Number(newIncoming.amount)

  await User.findByIdAndUpdate(id, { balance: newBalance }, { new: true })

  sendSuccessRes(res, { balance: newBalance, result }, 201)
}

module.exports = incoming
