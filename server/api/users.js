const express = require('express')
const Joi = require('joi')
const bcrypt = require('bcryptjs')

const Users = require('../db/user.model')

const router = express.Router()

const schema = Joi.object({
  username: Joi.string()
    .regex(/(^[a-zA-Z0-9_]+$)/)
    .min(2)
    .max(30),
  password: Joi.string().trim().min(8),

  // roles: Joi.array().items(
  //   Joi.string().valid('standard_user', 'admin', 'mods')
  // ),

  admin: Joi.bool(),
  developer: Joi.bool(),
})

router.get('/', async (req, res, next) => {
  try {
    // * adding " - " excludes the password
    const result = await Users.find({}, '-password')
    // When using string syntax, prefixing a path with - will flag that path as excluded.
    // When a path does not have the - prefix, it is included. Lastly, if a path is
    // prefixed with +, it forces inclusion of the path, which is useful for paths excluded at the schema level.
    res.json({ result })
  } catch (error) {
    next(error)
  }
})

router.patch('/:id', async (req, res, next) => {
  // pull or the id from the paras of the request
  const { id: _id } = req.params
  let { password } = req.body
  try {
    const result = schema.validate(req.body)
    if (!result.error) {
      const query = { _id }
      const user = await Users.findOne(query)
      if (user) {
        // if ps sent
        if (password) {
          // hash the reset ps b4 sending to db
          password = await bcrypt.hash(password, 10)
        }
        // set the password in the req to the hash
        req.body.password = password

        // query = user id
        await Users.findOneAndUpdate(
          query,
          req.body,
          {
            new: true,
          },
          (err, result) => {
            // Never, ever, mutate an argument directly. Ever.
            /* Non-configurable properties cannot be 
            re-configured or deleted. i.e err, result etc... */
            result = result.toObject()
            delete result.password
            if (err) {
              next(err)
            } else {
              res.json(result)
            }
          }
        ).exec()
      } else {
        const error = new Error('User with that id not found')
        res.status(404)
        next(error)
      }
    } else {
      const error = new Error(result.error)
      next(error)
    }
  } catch (error) {
    next(error)
  }
})

module.exports = router
