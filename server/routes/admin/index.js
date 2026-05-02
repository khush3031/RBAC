const routes = require("express").Router()
const authRoutes = require("./auth")
const userRoutes = require("./user")
const roleRoutes = require("./role")

routes.use("/auth", authRoutes)
routes.use("/users", userRoutes)
routes.use("/roles", roleRoutes)

module.exports = routes