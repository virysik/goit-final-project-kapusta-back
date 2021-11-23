const { Schema, model } = require('mongoose')
const bcrypt = require('bcrypt')
const Joi = require('joi')

const userSchema = Schema(
  {
    password: {
      type: String,
      required: [true, 'Password is required']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true
    },
    name: {
      type: String,
      required: true
    },
    token: {
      type: String,
      default: null
    },
    verifyToken: {
      type: String
    },
    balance: {
      type: Number,
      default: 0
    }
  },
  { versionKey: false, timestamps: true }
)

const userJoiSchema = Joi.object({
  password: Joi.string().required(),
  name: Joi.string().required(),
  email: Joi.string().required()
})

const userJoiSchemaLogin = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().required()
})

const updatebalanceJoiSchema = Joi.object({
  balance: Joi.number().required()
})

userSchema.methods.setPassword = function (password) {
  this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

userSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}

const User = model('user', userSchema)

module.exports = {
  User,
  userJoiSchema,
  updatebalanceJoiSchema,
  userJoiSchemaLogin
}
