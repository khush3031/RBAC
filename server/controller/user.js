const userService = require("../service/user")

const createUser = async (req, res) => {
    try {
        const result = await userService.createUser(req.body)
        if (!result.status) return res.status(400).json({ message: result.msg, status: "Error" })
        return res.status(201).json({ data: result.data, message: "User created successfully.", status: "Success" })
    } catch (error) {
        console.error("Error - createUser controller:", error)
        return res.status(500).json({ message: "Internal server error.", status: "Error" })
    }
}

const updateUser = async (req, res) => {
    try {
        const result = await userService.updateUser(req.params.id, req.body)
        if (!result.status) return res.status(400).json({ message: result.msg, status: "Error" })
        return res.status(200).json({ data: result.data, message: "User updated successfully.", status: "Success" })
    } catch (error) {
        console.error("Error - updateUser controller:", error)
        return res.status(500).json({ message: "Internal server error.", status: "Error" })
    }
}

const getOne = async (req, res) => {
    try {
        const result = await userService.getOne(req.params.id)
        if (!result) return res.status(404).json({ message: "User not found.", status: "Error" })
        return res.status(200).json({ data: result, message: "User fetched successfully.", status: "Success" })
    } catch (error) {
        console.error("Error - getOne controller:", error)
        return res.status(500).json({ message: "Internal server error.", status: "Error" })
    }
}

const getAll = async (req, res) => {
    try {
        const result = await userService.getAll()
        return res.status(200).json({ data: result, message: "Users fetched successfully.", status: "Success" })
    } catch (error) {
        console.error("Error - getAll controller:", error)
        return res.status(500).json({ message: "Internal server error.", status: "Error" })
    }
}

const deleteUser = async (req, res) => {
    try {
        const result = await userService.deleteUser(req.params.id)
        if (!result.status) return res.status(400).json({ message: result.msg, status: "Error" })
        return res.status(200).json({ message: result.msg, status: "Success" })
    } catch (error) {
        console.error("Error - deleteUser controller:", error)
        return res.status(500).json({ message: "Internal server error.", status: "Error" })
    }
}

module.exports = { createUser, updateUser, deleteUser, getAll, getOne }