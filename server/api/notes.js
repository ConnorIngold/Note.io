const express = require('express')

const Joi = require('joi')

const mongoose = require('mongoose')
const Note = require('../db/note.model')

const router = express.Router()

router.get('/', (req, res) => {
  res.send('h')
})

// ... adds title & the note
// (...) allows an iterable such as an array expression or string to be expanded
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
// also god be thought of as merging two objects

const schema = Joi.object({
  title: Joi.string()
    .regex(/(^[a-zA-Z0-9_]+$)/)
    .min(2)
    .max(30)
    .required(),
  note: Joi.string().required(),
})

router.post('/', (req, res, next) => {
  const result = schema.validate(req.body)
  console.log('result.error: ', result.error)

  if (result.error === null || result.error === undefined) {
    const newNote = new Note({
      _id: new mongoose.Types.ObjectId(),
      user_id: req.user._id,
      ...req.body,
    })

    console.log('User id: ', newNote)
    newNote.save((err, newNote) => {
      if (err) {
        return res.send({
          success: false,
          message: 'Server error: ' + err,
        })
      }
      console.log('note: ', newNote)
      res.status(200).json(newNote)
    })
  } else {
    console.log('result ', result)
    const error = new Error(result.error)
    res.status(422)
    next(error)
  }
})

module.exports = router
