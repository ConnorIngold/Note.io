const express = require('express')
const Joi = require('joi')

const users = require('../db/user.model')

const router = express.Router()

const schema = Joi.object({
  username: Joi.string()
    .regex(/(^[a-zA-Z0-9_]+$)/)
    .min(2)
    .max(30)
    .required(),
  password: Joi.string().trim().min(8).required(),
  roles: Joi.array().items(
    Joi.string().valid('standard_user', 'admin', 'mods')
  ),
  active: Joi.bool(),
})

router.get('/', async (req, res, next) => {
  try {
    // * adding " - " excludes the password
    const result = await users.find({}, '-password')
    // When using string syntax, prefixing a path with - will flag that path as excluded.
    // When a path does not have the - prefix, it is included. Lastly, if a path is
    // prefixed with +, it forces inclusion of the path, which is useful for paths excluded at the schema level.

    res.json(result)
  } catch (error) {
    next(error)
  }
})

router.patch('/:id', async (req, res, next) => {
  // pull or the id from the paras of the request
  const { id: _id } = req.params

  // res.json({ _id })

  try {
    // validate req body
    const result = schema.validate(req.body)
    if (!result.error) {
      const query = { _id }
      const user = await users.findOne({ _id }, '-password')
      if (user) {
        const updatedUser = {
          ...user,
          ...req.body,
        }
        await users.findOneAndUpdate(query, {
          $set: updatedUser,
        })
        updatedUser.password = ''
        res.json(updatedUser)
      } else {
        next()
      }
    } else {
      res.status(422)
      throw new Error(result.error)
    }
  } catch (error) {
    next(error)
  }

  // if valid: find user in db with giveQn id
  // update user in db
  // respond with user
  // if not valid - send an error with the reason why
  // if not exists - send 4040
})

module.exports = router
