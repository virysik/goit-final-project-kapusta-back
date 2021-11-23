const sendSuccessRes = (res, data, status = 200, message) => {
  res.status(status).json({
    status: 'success',
    code: status,
    data,
    message
  })
}

module.exports = sendSuccessRes
