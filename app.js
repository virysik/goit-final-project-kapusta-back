const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json')

const app = express()

const usersRouter = require('./routes/api/users')
const transactionsRouter = require('./routes/api/transactions')

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())

app.use('/api/users', usersRouter)
app.use('/api/transactions', transactionsRouter)
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    code: 404,
    message: 'Not found'
  })
})

app.use((err, req, res, next) => {
  const { status = 500, message = 'Server error' } = err
  res.status(status).json({
    status: 'error',
    code: status,
    message
  })
})

module.exports = app
