const mongoose = require("mongoose")

const Schema = mongoose.Schema

const UserSchema = new Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    password: {
      type: String,
      required: true,
    },
    developer: {
      type: Boolean,
      required: false,
    },
    admin: {
      type: Boolean,
      required: false,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model("User", UserSchema)
