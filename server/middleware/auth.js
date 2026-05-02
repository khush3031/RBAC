const User = require("../models/user")
const jwt = require("jsonwebtoken")

const authentication = async (req, res, next) => {
    try {
        const auth = req.header("Authorization")
        if (!auth || !auth.startsWith("Bearer "))
            return res.status(401).json({ message: "Unauthorized. Token missing.", status: "Error" })

        const token = auth.split(" ")[1]

        let decoded
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET)
        } catch {
            return res.status(401).json({ message: "Invalid or expired token.", status: "Error" })
        }

        const user = await User.findById(decoded.id).populate("role").select("-password -token")
        if (!user || !user.isActive)
            return res.status(401).json({ message: "User not found or inactive.", status: "Error" })

        req.user = user
        next()
    } catch (error) {
        console.error("Error - authentication:", error)
        return res.status(500).json({ message: "Internal server error.", status: "Error" })
    }
}

const checkPermission = (permission) => {
    return (req, res, next) => {
        try {
            const user = req.user
            if (!user) return res.status(401).json({ message: "Unauthorized.", status: "Error" })

            const userPermissions = user.role?.permissions || []

            if (permission === "user:self_read" || permission === "user:self_edit") {
                const targetId = req.params.id
                const isSelf = targetId && targetId.toString() === user._id.toString()
                if (isSelf && userPermissions.includes(permission)) return next()
                const adminEquivalent = permission === "user:self_read" ? "user:read" : "user:update"
                if (userPermissions.includes(adminEquivalent)) return next()
                return res.status(403).json({ message: "Insufficient permissions.", status: "Error" })
            }

            if (userPermissions.includes(permission)) return next()

            return res.status(403).json({ message: "Insufficient permissions.", status: "Error" })
        } catch (error) {
            console.error("Error - checkPermission:", error)
            return res.status(500).json({ message: "Internal server error.", status: "Error" })
        }
    }
}

module.exports = { authentication, checkPermission }