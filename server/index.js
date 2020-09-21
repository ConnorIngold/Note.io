const express = require("express")
const morgan = require("morgan")
const cors = require("cors")

const app = express()

const middlewares = require("./auth/middlewares.js")
const auth = require("./auth/index.js")

app.use(express.json())
app.use(morgan("dev"))
app.use(cors())
app.use(middlewares.checkTokenSetUser)

app.get("/", (req, res) => {
  res.json({
    message: "🦄🌈✨Hello World! 🌈✨🦄",
    user: req.user
  })
})

app.use("/auth", auth)

const notFound = (req, res, next) =>{
  res.status(404)
  const error = new Error("Not Found - " + req.originalUrl)
  next(error)
}

const errorHandler = (err, req, res, next) =>{
  res.status(res.statusCode || 500)
  res.json({
    message: err.message,
    stack: err.stack,
  })
}

app.use(notFound)
app.use(errorHandler)

const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log("Listening on http://localhost", port)
})
