const { sendSuccessRes } = require('../../helpers')
const { BadRequest } = require('http-errors')
const { summary } = require('../../helpers')

const outgoingsSummaryForYear = async (req, res, next) => {
  const _id = res.locals.user.id
  const { year } = req.query

  if (!year) {
    throw new BadRequest('Year is required')
  }

  const result = await summary(_id, year, false)

  sendSuccessRes(res, { year, result }, 200)
}

module.exports = outgoingsSummaryForYear
