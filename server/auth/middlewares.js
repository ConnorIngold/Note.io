const jwt = require('jsonwebtoken')

const checkTokenSetUser = (req, res, next) => {
  const authHeader = req.get('authorization')
  if (authHeader) {
    const token = authHeader.split(' ')[1]
    // console.log('token:', token)
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
    next()
  } else {
    let error = new Error('Not authorized')
    res.status(401)
    next(error)
  }
}

module.exports = {
  checkTokenSetUser,
  isLoggedIn,
}
