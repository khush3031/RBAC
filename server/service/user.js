const User = require("../models/user")
const Role = require("../models/role")

/**
 * Create a new user (admin operation)
 */
const createUser = async (data) => {
    try {
        const isUserExists = await User.findOne({ email: data.email?.toLowerCase() })
        if (isUserExists) return { status: false, msg: "User with this email already exists." }

        const role = await Role.findOne({ code: data.role?.toUpperCase() })
        if (!role) return { status: false, msg: "Invalid role code provided." }

        const user = await User.create({
            name: data.name,
            email: data.email.toLowerCase(),
            password: data.password,
            role: role._id
        })

        const userObj = user.toObject()
        delete userObj.password
        delete userObj.token

        return { data: userObj, status: true }
    } catch (error) {
        console.error("Error - createUser service:", error)
        throw new Error(error)
    }
}

/**
 * Update user by ID
 */
const updateUser = async (id, data) => {
    try {
        const user = await User.findById(id)
        if (!user) return { status: false, msg: "User not found." }

        // If updating role, validate it
        if (data.role) {
            const role = await Role.findOne({ code: data.role.toUpperCase() })
            if (!role) return { status: false, msg: "Invalid role code provided." }
            data.role = role._id
        }

        // Never allow password update via this path
        delete data.password
        delete data.token

        const updated = await User.findByIdAndUpdate(id, data, { new: true }).populate("role")
        const userObj = updated.toObject()
        delete userObj.password
        delete userObj.token

        return { data: userObj, status: true }
    } catch (error) {
        console.error("Error - updateUser service:", error)
        throw new Error(error)
    }
}

/**
 * Get one user by ID
 */
const getOne = async (id) => {
    try {
        const user = await User.findById(id).populate("role")
        if (!user) return null
        const userObj = user.toObject()
        delete userObj.password
        delete userObj.token
        return userObj
    } catch (error) {
        console.error("Error - getOne service:", error)
        throw new Error(error)
    }
}

/**
 * Get all users
 */
const getAll = async () => {
    try {
        const users = await User.find().populate("role").select("-password -token")
        return users
    } catch (error) {
        console.error("Error - getAll service:", error)
        throw new Error(error)
    }
}

/**
 * Delete user by ID
 */
const deleteUser = async (id) => {
    try {
        const user = await User.findById(id)
        if (!user) return { status: false, msg: "User not found." }
        await User.deleteOne({ _id: id })
        return { status: true, msg: "User deleted successfully." }
    } catch (error) {
        console.error("Error - deleteUser service:", error)
        throw new Error(error)
    }
}

module.exports = { createUser, updateUser, getOne, getAll, deleteUser }