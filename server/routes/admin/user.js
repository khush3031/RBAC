const route = require("express").Router()
const userController = require("../../controller/user")
const { authentication, checkPermission } = require("../../middleware/auth")

// GET  /api/users        — requires user:read
route.get("/", authentication, checkPermission("user:read"), userController.getAll)

// GET  /api/users/:id    — requires user:read OR user:self_read (self-access)
route.get("/:id", authentication, checkPermission("user:self_read"), userController.getOne)

// POST /api/users        — requires user:create
route.post("/", authentication, checkPermission("user:create"), userController.createUser)

// PUT  /api/users/:id    — requires user:update OR user:self_edit (self-access)
route.put("/:id", authentication, checkPermission("user:self_edit"), userController.updateUser)

// DELETE /api/users/:id  — requires user:delete
route.delete("/:id", authentication, checkPermission("user:delete"), userController.deleteUser)

module.exports = route