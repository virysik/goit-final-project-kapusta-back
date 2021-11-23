const { sendSuccessRes } = require('../../helpers')
const { Transaction, User } = require('../../models')

const outgoings = async (req, res) => {
  const id = res.locals.user._id
  const newOutgoing = { ...req.body, owner: id, typeOftransactions: false }
  const result = await Transaction.create(newOutgoing)

  const newBalance = res.locals.user.balance - newOutgoing.amount

  await User.findByIdAndUpdate(id, { balance: newBalance }, { new: true })

  sendSuccessRes(res, { balance: newBalance, result }, 201)
}

module.exports = outgoings

// const data = new Date()
// const options = {
//   year: 'numeric',
//   month: 'long',
//   day: 'numeric',
//   timezone: 'UTC'

// }

// console.log(data.toLocaleString('ru', options))
