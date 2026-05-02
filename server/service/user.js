const { isExists, create, findOneAndUpdate } = require("../config/dbService")
const User = require("../models/user")
const Role = require("../models/role")

const createUser = async (data) => {
    try {
        const isUserExists = await isExists({ email: data.email }, User)
        if (isUserExists) return { status: false, msg: "User with this email already exists." }
        const role = await isExists({ code: data.role }, Role)
        if (!role) return { status: false, msg: "Invalid role code provided." }

        const user = await create({
            name: data.name,
            email: data.email.toLowerCase(),
            password: data.password,
            role: role._id
        }, User)

        const userObj = user.toObject()
        delete userObj.password
        delete userObj.token

        return { data: userObj, status: true }
    } catch (error) {
        console.error("Error - createUser service:", error)
        throw new Error(error)
    }
}

const updateUser = async (id, data) => {
    try {
        const user = await User.findById(id)
        if (!user) return { status: false, msg: "User not found." }
        delete data.password
        delete data.token
        delete data.email
        delete data.role

        const updated = await User.findByIdAndUpdate(id, data, { returnDocument: "after" }).populate("role")
        const userObj = updated.toObject()
        delete userObj.password
        delete userObj.token

        return { data: userObj, status: true }
    } catch (error) {
        console.error("Error - updateUser service:", error)
        throw new Error(error)
    }
}

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

const getAll = async () => {
    try {
        const users = await User.find().populate("role").select("-password -token")
        return users
    } catch (error) {
        console.error("Error - getAll service:", error)
        throw new Error(error)
    }
}

const deleteUser = async (id) => {
    try {
        const isUserExists = await isExists({ email: data.email }, User)
        if (!isUserExists) return { status: false, msg: "User not found." }
        await User.deleteOn({ _id: id })
        return { status: true, msg: "User deleted successfully." }
    } catch (error) {
        console.error("Error - deleteUser service:", error)
        throw new Error(error)
    }
}

module.exports = { createUser, updateUser, getOne, getAll, deleteUser }