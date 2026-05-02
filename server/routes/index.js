const routes = require("express").Router()

// All API routes are mounted from here
// /api/auth  → public auth (login, register, me)
// /api/users → user management
// /api/roles → role management
// /api/admin/seed → admin seeding tool

const authRoutes = require("./client/auth")
const userRoutes = require("./admin/user")
const roleRoutes = require("./admin/role")
const seedRoutes = require("./admin/seed")

routes.use("/auth", authRoutes)
routes.use("/users", userRoutes)
routes.use("/roles", roleRoutes)
routes.use("/admin/seed", seedRoutes)

module.exports = routes