const getTotal = (alltransactions) => {
  let incomings = 0
  let expenses = 0

  alltransactions.forEach(trans => {
    if (trans.typeOftransactions) {
      incomings += trans.amount
    }

    if (!trans.typeOftransactions) {
      expenses += trans.amount
    }
  })

  const total = [
    { type: 'incomings', sum: incomings },
    { type: 'expenses', sum: expenses }
  ]

  return total
}

module.exports = getTotal
