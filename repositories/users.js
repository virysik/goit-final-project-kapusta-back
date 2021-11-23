const { User } = require('../models')

const findUserByEmail = async (email) => {
  try {
    return await User.findOne({ email })
  } catch (error) {
    console.log(error.message)
  }
}

const createUser = async ({ _id, name, email, password }) => {
  try {
    const user = new User({ _id, name, email })
    user.setPassword(password)

    return await user.save()
  } catch (error) {
    console.log(error.message)
  }
}

const updateToken = async (id, token) => {
  try {
    return await User.updateOne({ _id: id }, { token })
  } catch (error) {
    console.log(error.message)
  }
}

const findUserById = async (id) => {
  try {
    return await User.findById(id)
  } catch (error) {
    console.log(error.message)
  }
}

const updateBalance = async (id, data) => {
  try {
    return await User.updateOne({ _id: id }, { balance: data })
  } catch (error) {
    console.log(error.message)
  }
}

const getBalance = async (id) => {
  try {
    return await User.findOne({ _id: id }, 'balance')
  } catch (error) {
    console.log(error.message)
  }
}

module.exports = {
  findUserByEmail,
  createUser,
  updateToken,
  findUserById,
  updateBalance,
  getBalance
}
