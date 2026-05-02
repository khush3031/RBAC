require("dotenv").config()
const express = require("express")
const cors = require("cors")
const connectDb = require("./config/db")
const routes = require("./routes/index")

const app = express()

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({
    origin: "*", // Restrict in production
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// ── Database ────────────────────────────────────────────────────────────────
connectDb().then(async () => {
    // Run seeder after DB connects (idempotent)
    const seedData = require("./seeder/seed")
    await seedData()
})

// ── Routes ──────────────────────────────────────────────────────────────────
app.use("/api", routes)

// ── Health Check ────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
    res.json({ message: "RBAC API is running.", status: "OK", version: "1.0.0" })
})

// ── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found.`, status: "Error" })
})

// ── Global Error Handler ────────────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err)
    res.status(500).json({ message: "Internal server error.", status: "Error" })
})

// ── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 6000
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))

module.exports = app