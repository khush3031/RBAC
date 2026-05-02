const route = require("express").Router()
const { authentication, requireAdmin } = require("../../middleware/auth")
const seedData = require("../../seeder/seed")

// POST /api/admin/seed — triggers manual seed (ADMIN only)
route.post("/", authentication, requireAdmin, async (req, res) => {
    try {
        await seedData()
        return res.status(200).json({ message: "Seed completed successfully.", status: "Success" })
    } catch (error) {
        console.error("Error - seed route:", error)
        return res.status(500).json({ message: "Seed failed. Check server logs.", status: "Error" })
    }
})

module.exports = route
