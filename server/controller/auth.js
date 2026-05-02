const authService = require("../service/auth")

const register = async (req, res) => {
    try {
        const result = await authService.register(req.body)
        if (!result.status) return res.status(400).json({ message: result.msg, status: "Error" })
        return res.status(201).json({ data: result.data, message: "User registered successfully.", status: "Success" })
    } catch (error) {
        console.error("Error - register controller:", error)
        return res.status(500).json({ message: "Internal server error.", status: "Error" })
    }
}

const login = async (req, res) => {
    try {
        const result = await authService.login(req.body)
        if (!result.status) return res.status(401).json({ message: result.msg, status: "Error" })
        return res.status(200).json({ data: result.data, message: "Login successful.", status: "Success" })
    } catch (error) {
        console.error("Error - login controller:", error)
        return res.status(500).json({ message: "Internal server error.", status: "Error" })
    }
}

const getMe = async (req, res) => {
    try {
        const user = req.user.toObject ? req.user.toObject() : { ...req.user }
        delete user.password
        delete user.token
        return res.status(200).json({
            data: {
                ...user,
                permissions: req.user.role?.permissions || []
            },
            message: "Profile fetched.",
            status: "Success"
        })
    } catch (error) {
        console.error("Error - getMe controller:", error)
        return res.status(500).json({ message: "Internal server error.", status: "Error" })
    }
}

module.exports = { register, login, getMe }