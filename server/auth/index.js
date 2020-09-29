const express = require('express')
const router = express.Router()
const Joi = require('joi')
const mongoose = require('mongoose')

const db = require('../db/connection')
const User = require('../db/user.model')

const bcrypt = require('bcryptjs')

const jwt = require('jsonwebtoken')

require('dotenv').config()

const schema = Joi.object({
  username: Joi.string()
    .regex(/(^[a-zA-Z0-9_]+$)/)
    .min(2)
    .max(30)
    .required(),
  password: Joi.string().trim().min(8).required(),
})

const createTokenSendResponse = (user, res, next) => {
  // create payload
  const payload = {
    _id: user._id,
    username: user.username,
  }
  console.log('secret', process.env.TOKEN_SECRET)
  jwt.sign(
    payload,
    process.env.TOKEN_SECRET,
    {
      expiresIn: '7d',
    },
    (err, token) => {
      if (err) {
        console.log('Error creating token: ', err)
        respondError422(res, next)
      } else {
        res.status(200).json({
          token,
        })
      }
    }
  )
}

router.get('/', (req, res) => {
  res.json({
    message: 'Hello world',
  })
})

// POST /auth/signup

router.get('/signup', (req, res) => {
  res.json({
    message: 'Hello world',
  })
})

router.post('/signup', (req, res, next) => {
  console.log('Body: ', req.body)
  // res.json(schema.validate(req.body))

  const result = schema.validate(req.body)

  if (!result.error) {
    console.log('valid data')
    const { username, password, admin, developer } = req.body
    User.findOne({
      username: req.body.username,
    }).then(user => {
      if (user) {
        const error = new Error('That username is already in use')
        res.status(409)
        next(error)
      } else {
        console.log('user does not exist... yet')
        bcrypt.hash(password, 10, (err, hash) => {
          let newUser = new User({
            _id: new mongoose.Types.ObjectId(),
            username: username,
            password: hash,
            developer: developer,
            admin: admin,
          })
          newUser.save((err, newUser) => {
            if (err) {
              return res.send({
                success: false,
                message: 'Server error: ' + err,
              })
            }
            // else

            // sign immediately
            return createTokenSendResponse(newUser, res, next)
          })
        })
      }
    })
  } else {
    next(result.error)
  }
})

const respondError422 = (res, next) => {
  res.status(422)
  const error = new Error('Unable to login.')
  next(error)
}

router.post('/login', (req, res, next) => {
  const result = schema.validate(req.body)
  // if no errors
  if (!result.error) {
    User.findOne({
      username: req.body.username,
    }).then(user => {
      // if found user in db
      if (user) {
        console.log('user found')
        console.log('Comparing passwords...')
        // password is user input
        // it takes its then hash's it then compares its
        // to the one in the db
        bcrypt.compare(req.body.password, user.password).then(result => {
          if (result) {
            // ps correct
            console.log('ps correct')

            createTokenSendResponse(user, res, next)
          } else {
            console.log('ps not correct')
            respondError422(res, next)
          }
        })
      } else {
        console.log('user not found')
        respondError422(res, next)
      }
    })
  } else {
    next(result.error)
  }
})

module.exports = router
