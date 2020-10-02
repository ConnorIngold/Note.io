require('dotenv').config()
const mongoose = require('mongoose')

const Users = require('../db/user.model')
const bcrypt = require('bcryptjs')
require('../db/connection')

const createDevUser = async () => {
  try {
    const user = await Users.findOne({ developer: true })
    if (!user) {
      let newUser = new Users({
        _id: new mongoose.Types.ObjectId(),
        username: 'Developer',
        password: await bcrypt.hash(process.env.DEFAULT_DEV_PASSWORD, 12),
        developer: true,
      })

      await newUser.save((err, newUser) => {
        if (err) {
          return console.log({
            success: false,
            message: 'Server error: ' + err,
          })
        }
        return console.log(`developer user created, Hello: ${newUser.username}`)
      })
    } else {
      console.log('developer user already exists')
    }
  } catch (error) {
    console.log(error)
  }
}

createDevUser()
