const User = require("../models/user")
const Role = require("../models/role")
const { isExists, create, isPassMatched, updateOne } = require("../config/dbService")
const { generateToken } = require("../config/helper")

const register = async (data) => {
    try {
        const isUserExists = await isExists({ email: data.email }, User)
        if (isUserExists) return { status: false, msg: "User with this email already exists." }

        const role = await isExists({ code: data.role }, Role)
        if (!role) return { status: false, msg: "Invalid role code provided." }

        const user = await User.create({
            name: data.name,
            email: data.email.toLowerCase(),
            password: data.password,
            role: role._id
        })

        const token = await generateToken(user)
        await User.findByIdAndUpdate(user._id, { token })

        const userObj = user.toObject()
        delete userObj.password
        delete userObj.token

        return { data: { ...userObj, token, permissions: role.permissions }, status: true }
    } catch (error) {
        console.error("Error - register service:", error)
        throw new Error(error)
    }
}

const login = async (data) => {
    try {
        const user = await User.findOne({ email: data.email.toLowerCase() })
            .select("+password")
            .populate("role")

        if (!user) return { status: false, msg: "Invalid email or password." }
        if (!user.isActive) return { status: false, msg: "Account is deactivated." }

        const isPasswordMatched = await user.comparePassword(data.password)
        if (!isPasswordMatched) return { status: false, msg: "Invalid email or password." }

        const token = await generateToken(user)
        await updateOne({ email: data.email }, { token }, User)
        const userObj = user.toObject()
        delete userObj.password
        delete userObj.token

        return {
            data: { ...userObj, token, permissions: user.role?.permissions || [] },
            status: true
        }
    } catch (error) {
        console.error("Error - login service:", error)
        throw new Error(error)
    }
}

module.exports = { register, login }