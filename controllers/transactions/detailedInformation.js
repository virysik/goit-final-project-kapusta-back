const { Transaction } = require('../../models')
const { sendSuccessRes } = require('../../helpers')
const { getTotal } = require('../../helpers')
const { BadRequest } = require('http-errors')

const detailedInformation = async (req, res, next) => {
  const _id = res.locals.user.id
  const { year, month } = req.query

  if (!year) {
    throw new BadRequest('Year is require.')
  }

  if (!month) {
    throw new BadRequest('Month is require.')
  }

  const allTransactions = await Transaction.find({
    owner: _id,
    year,
    month
  })

  const allIncomingsTransactions = allTransactions
    .filter(category => category.typeOftransactions)

  const allExpensesTransactions = allTransactions
    .filter(category => !category.typeOftransactions)

  const incomingsCategoryList = allIncomingsTransactions.reduce((acc, transaction) => {
    if (!acc.includes(transaction.category)) {
      acc.push(transaction.category)
    }

    return acc
  }, [])

  const expensesCategoryList = allExpensesTransactions.reduce((acc, transaction) => {
    if (!acc.includes(transaction.category)) {
      acc.push(transaction.category)
    }

    return acc
  }, [])

  const incomings = incomingsCategoryList.map(category => {
    const sum = allIncomingsTransactions.reduce((acc, transaction) => {
      if (transaction.category === category) {
        acc += transaction.amount
      }

      return acc
    }, 0)

    const currentСategoryTransactions = allIncomingsTransactions.filter(cat => cat.category === category)

    const subcategory = currentСategoryTransactions.reduce((acc, transaction) => {
      if (!acc.includes(transaction.description)) {
        acc.push(transaction.description)
      }

      return acc
    }, [])

    const details = subcategory.map(category => {
      const sum = currentСategoryTransactions.reduce((acc, transaction) => {
        if (transaction.description === category) {
          acc += transaction.amount
        }

        return acc
      }, 0)

      return { name: category, sum }
    })

    return { category, sum, details }
  })

  const expenses = expensesCategoryList.map(category => {
    const sum = allExpensesTransactions.reduce((acc, transaction) => {
      if (transaction.category === category) {
        acc += transaction.amount
      }

      return acc
    }, 0)

    const currentСategoryTransactions = allExpensesTransactions.filter(cat => cat.category === category)

    const subcategory = currentСategoryTransactions.reduce((acc, transaction) => {
      if (!acc.includes(transaction.description)) {
        acc.push(transaction.description)
      }

      return acc
    }, [])

    const details = subcategory.map(category => {
      const sum = currentСategoryTransactions.reduce((acc, transaction) => {
        if (transaction.description === category) {
          acc += transaction.amount
        }

        return acc
      }, 0)

      return { name: category, sum }
    })

    return { category, sum, details }
  })

  const total = getTotal(allTransactions)

  sendSuccessRes(res, { total, incomings, expenses }, 200)
}

module.exports = detailedInformation
