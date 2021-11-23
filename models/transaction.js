const { Schema, model } = require('mongoose')
const Joi = require('joi')

const transactionSchema = Schema(
  {
    typeOftransactions: {
      type: Boolean,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user'
    },
    day: {
      type: String,
      required: true
    },
    month: {
      type: String,
      required: true
    },
    year: {
      type: String,
      required: true
    }
  },
  { versionKey: false, timestamps: true }
)

const transactionJoiSchema = Joi.object({
  amount: Joi.number().required(),
  description: Joi.string().required(),
  category: Joi.string().required(),
  day: Joi.string().required(),
  month: Joi.string().required(),
  year: Joi.string().required()
})

const transactionByMonthJoiSchema = Joi.object({
  year: Joi.number().required(),
  month: Joi.string().required()
})

const balanceByYearJoiSchema = Joi.object({
  year: Joi.string().required()
})

const Transaction = model('transaction', transactionSchema)

module.exports = {
  Transaction,
  transactionJoiSchema,
  balanceByYearJoiSchema,
  transactionByMonthJoiSchema
}
