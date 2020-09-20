const mongoose = require("mongoose")
require("dotenv").config()

mongoose
  .connect(process.env.DB_HOST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("db connected"))
  .catch((err) => console.log(err))
