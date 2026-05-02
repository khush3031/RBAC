const routes = require("express").Router()
const authRoutes = require("./auth")

routes.use("/auth", authRoutes)

module.exports = routes