require('dotenv').config()
const HttpCode = require('../helpers/constants')
const Users = require('../repositories')
const jwt = require('jsonwebtoken')
const queryString = require('query-string')
const axios = require('axios')
const bcrypt = require('bcryptjs')
const { nanoid } = require('nanoid')
const SECRET_KEY = process.env.SECRET_KEY
const { sendSuccessRes } = require('../helpers')

const signUp = async (req, res, next) => {
  try {
    const user = await Users.findUserByEmail(req.body.email)
    res.locals.user = user
    if (user) {
      return res.status(HttpCode.CONFLICT).json({
        status: 'error',
        code: HttpCode.CONFLICT,
        message: 'Email in use',
      })
    }
    const { id } = await Users.createUser(req.body)

    return res
      .status(HttpCode.CREATED)
      .json({ status: 'succes', code: HttpCode.CREATED, id })
  } catch (error) {
    next(error)
  }
}

const logIn = async (req, res, next) => {
  try {
    const user = await Users.findUserByEmail(req.body.email)
    const isValidPassword = await user?.isValidPassword(req.body.password)

    if (!user || !isValidPassword) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: 'error',
        code: HttpCode.UNAUTHORIZED,
        message: 'Email or password is wrong',
      })
    }
    const { id, name, balance } = user
    const payload = { id }
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1d' })
    await Users.updateToken(id, token)
    const { email } = await req.body
    return res.status(HttpCode.OK).json({
      status: 'succes',
      code: HttpCode.OK,
      id,
      email,
      name,
      balance,
      token,
    })
    // sendSuccessRes(res, { email, name, balance, token }, HttpCode.OK)
  } catch (error) {
    next(error)
  }
}

const logout = async (req, res, next) => {
  try {
    const id = res.locals.user.id
    await Users.updateToken(id, null)
    return res.status(HttpCode.NO_CONTENT).json({})
  } catch (error) {
    next(error)
  }
}

const userBalanceUpdate = async (req, res, next) => {
  try {
    const { balance } = req.body
    const id = res.locals.user.id
    await Users.findUserById(id)
    await Users.updateBalance(id, balance)
    return res.status(HttpCode.OK).json({ status: 'succes', payload: balance })
  } catch (error) {
    next(error)
  }
}

const getUserBalance = async (req, res, next) => {
  try {
    // const { balance } = req.body
    const id = res.locals.user.id
    await Users.findUserById(id)
    const userbalance = await Users.getBalance(id)
    return res
      .status(HttpCode.OK)
      .json({ status: 'succes', payload: userbalance })
  } catch (error) {
    next(error)
  }
}

const getCurrent = async (req, res, next) => {
  try {
    const { authorization } = req.headers
    if (!authorization) {
      throw new Error('Not authorized')
    }
    const [bearer, token] = authorization.split(' ')
    if (!token) {
      throw new Error('Not authorized')
    }
    const { id } = jwt.verify(token, SECRET_KEY)

    const user = await Users.findUserById(id)
    const { email, name, balance } = user
    sendSuccessRes(res, { id, email, name, balance }, 200)
  } catch (error) {
    res.status(401).json({
      status: 'Error',
      code: 401,
      message: error.message,
    })
  }
}

const googleAuth = async (req, res) => {
  const stringifiedParams = queryString.stringify({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: `${process.env.BASE_URL}/api/users/google-redirect`,
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ].join(' '),
    response_type: 'code',
    access_type: 'offline',
    prompt: 'consent',
  })

  return res.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`,
  )
}

const googleRedirect = async (req, res) => {
  const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`
  const urlObj = new URL(fullUrl)
  const urlParams = queryString.parse(urlObj.search)
  const code = urlParams.code
  const tokenData = await axios({
    url: 'https://oauth2.googleapis.com/token',
    method: 'post',
    data: {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${process.env.BASE_URL}/api/users/google-redirect`,
      grant_type: 'authorization_code',
      code,
    },
  })
  const userData = await axios({
    url: 'https://www.googleapis.com/oauth2/v2/userinfo',
    method: 'get',
    headers: {
      Authorization: `Bearer ${tokenData.data.access_token}`,
    },
  })
  const email = userData.data.email
  const name = userData.data.given_name
  const user = await Users.findUserByEmail(email)
  if (!user) {
    const password = nanoid()
    const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
    const newUser = {
      email,
      name,
      password: hashPassword,
    }
    const user = await Users.createUser(newUser)
    const { id } = user
    const payload = {
      id,
    }
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1d' })
    await Users.updateToken(id, token)
    return res.redirect(
      `${process.env.HOME_URL}/google-redirect/?token=${token}&email=${
        user.email
      }&balance=${user.balance}&name=${Object.values(user)[2].name}`,
    )
  }
  const { id } = user
  const payload = {
    id,
  }
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1d' })
  await Users.updateToken(id, token)

  return res.redirect(
    `${process.env.HOME_URL}/google-redirect/?token=${token}&email=${
      user.email
    }&balance=${user.balance}&name=${Object.values(user)[2].name}`,
  )
}

module.exports = {
  signUp,
  logIn,
  logout,
  userBalanceUpdate,
  getUserBalance,
  getCurrent,
  googleAuth,
  googleRedirect,
}
