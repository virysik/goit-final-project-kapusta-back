const { sendSuccessRes } = require('../../helpers')
const { User } = require('../../models')

const setBalance = async (req, res) => {
  const id = res.locals.user._id
  const { balance } = req.body

  const result = await User.findByIdAndUpdate(id, { balance }, { new: true })

  sendSuccessRes(res, { result }, 201)
}

module.exports = setBalance
