require("dotenv").config()
const express = require("express")
const cors = require("cors")
const connectDb = require("./config/db")
const routes = require("./routes/index")

const app = express()

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

connectDb().then(async () => {
    const seedData = require("./seeder/seed")
    await seedData()
})
app.use("/api", routes)
app.get("/", (req, res) => {
    res.json({ message: "RBAC API is running.", status: "OK", version: "1.0.0" })
})
app.use((req, res) => {
    res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found.`, status: "Error" })
})
app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err)
    res.status(500).json({ message: "Internal server error.", status: "Error" })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))

module.exports = app