const route = require("express").Router()
const userController = require("../../controller/user")
const { authentication, checkPermission } = require("../../middleware/auth")

route.get("/", authentication, checkPermission("user:read"), userController.getAll)
route.get("/:id", authentication, checkPermission("user:self_read"), userController.getOne)
route.post("/", authentication, checkPermission("user:create"), userController.createUser)
route.put("/:id", authentication, checkPermission("user:self_edit"), userController.updateUser)
route.delete("/:id", authentication, checkPermission("user:delete"), userController.deleteUser)

module.exports = route