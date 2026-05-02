const route = require("express").Router()
const authController = require("../../controller/auth")

route.post("/register", authController.register)
route.post("/login", authController.login)

module.exports = route