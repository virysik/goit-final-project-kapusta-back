const totalAmount = (arr) => {
  return arr.reduce((previousValue, currentValue) => {
    return previousValue + currentValue.amount
  }, 0)
}

module.exports = totalAmount
