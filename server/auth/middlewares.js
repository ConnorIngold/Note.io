const jwt = require('jsonwebtoken')
require('dotenv').config()

const checkTokenSetUser = (req, res, next) => {
  const authHeader = req.get('authorization')
  if (authHeader) {
    const token = authHeader.split(' ')[1]
    console.log('token:', token)
    if (token) {
      jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) {
          console.log(err)
        }
        // add user to req globally
        req.user = user
        next()
      })
    } else {
      next()
    }
  } else {
    next()
  }
}

const isLoggedIn = (req, res, next) => {
  // if user exists
  if (req.user) {
    console.log('user is global', req.user)
    next()
  } else {
    unAuthorized(res, next)
  }
}

const isAdmin = (req, res, next) => {
  if (!req.user.developer) {
    return unAuthorized(res, next)
  }
  next()
}

const unAuthorized = (res, next) => {
  let error = new Error('Not authorized')
  res.status(401)
  next(error)
}

module.exports = {
  checkTokenSetUser,
  isLoggedIn,
  isAdmin,
}
