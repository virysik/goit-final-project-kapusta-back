const { Transaction } = require('../models')

const summaryForYear = async (_id, year, typeOftransactions) => {
  const alltransactions = await Transaction.find({
    owner: _id,
    year,
    typeOftransactions
  })

  const allMonth = alltransactions.reduce((allMonth, transaction) => {
    if (!allMonth.includes(transaction.month)) {
      allMonth.push(transaction.month)
    }

    return allMonth
  }, [])

  const summary = allMonth.map(month => {
    const sum = alltransactions.reduce((acc, transaction) => {
      if (transaction.month === month) {
        acc += transaction.amount
      }

      return acc
    }, 0)

    return { month, sum }
  })

  return summary
}

module.exports = summaryForYear
