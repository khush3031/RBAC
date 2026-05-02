const route = require("express").Router()
const roleController = require("../../controller/role")
const { authentication, checkPermission } = require("../../middleware/auth")

route.get("/", authentication, checkPermission("role:read"), roleController.getAllRoles)
route.get("/:id", authentication, checkPermission("role:read"), roleController.getOneRole)
route.post("/", authentication, checkPermission("role:create"), roleController.createRole)
route.put("/:id", authentication, checkPermission("role:update"), roleController.updateRole)
route.delete("/:id", authentication, checkPermission("role:delete"), roleController.deleteRole)

module.exports = route
