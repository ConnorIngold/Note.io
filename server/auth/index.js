const express = require("express")
const router = express.Router()
const Joi = require("joi")
const mongoose = require("mongoose")

const db = require("../db/connection")
const User = require("../db/user.model")

const bcrypt = require("bcryptjs")

const schema = Joi.object({
  username: Joi.string()
    .regex(/(^[a-zA-Z0-9_]+$)/)
    .min(2)
    .max(30)
    .required(),
  password: Joi.string().trim().min(8).required(),

  password2: Joi.ref("password"),
}).with("password", "password2")

router.get("/", (req, res) => {
  res.json({
    message: "Hello world",
  })
})

// POST /auth/signup

router.get("/signup", (req, res) => {
  res.json({
    message: "Hello world",
  })
})

router.post("/signup", (req, res, next) => {
  console.log("Body: ", req.body)
  // res.json(schema.validate(req.body))

  const result = schema.validate(req.body)

  if (!result.error) {
    console.log("valid data")
    const { username, password, admin, developer } = req.body
    User.findOne({
      username: req.body.username,
    }).then(user => {
      if (user) {
        const error = new Error("That username is already in use")
        res.status(409)
        next(error)
      } else {
        console.log("user does not exist... yet")
        bcrypt.hash(password, 10, (err, hash) => {
          let newUser = new User({
            _id: new mongoose.Types.ObjectId(),
            username: username,
            password: hash,
            developer: developer,
            admin: admin,
          })
          console.log("hi")
          console.log(newUser)

          newUser.save((err, newUser) => {
            if (err) {
              return res.send({
                success: false,
                message: "Server error: " + err,
              })
            }
            // else
            return res.status(200).json({
              user: newUser,
              msg: "User inserted/saved to db",
            })
          })
        })
      }
    })
  } else {
    next(result.error)
  }
})

module.exports = router
