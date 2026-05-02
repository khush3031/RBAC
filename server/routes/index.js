const routes = require("express").Router()
const authRoutes = require("./client/auth")
const userRoutes = require("./admin/user")
const roleRoutes = require("./admin/role")

routes.use("/auth", authRoutes)
routes.use("/users", userRoutes)
routes.use("/roles", roleRoutes)

module.exports = routes