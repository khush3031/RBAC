const route = require("express").Router()
const authController = require("../../controller/auth")
const { authentication } = require("../../middleware/auth")

route.post("/register", authController.register)
route.post("/login", authController.login)
route.get("/me", authentication, authController.getMe)

module.exports = route