const roleService = require("../service/role")

const createRole = async (req, res) => {
    try {
        const result = await roleService.createRole(req.body)
        if (!result.status) return res.status(400).json({ message: result.msg, status: "Error" })
        return res.status(201).json({ data: result.data, message: "Role created successfully.", status: "Success" })
    } catch (error) {
        console.error("Error - createRole controller:", error)
        return res.status(500).json({ message: "Internal server error.", status: "Error" })
    }
}

const getAllRoles = async (req, res) => {
    try {
        const result = await roleService.getAllRoles()
        return res.status(200).json({ data: result, message: "Roles fetched successfully.", status: "Success" })
    } catch (error) {
        console.error("Error - getAllRoles controller:", error)
        return res.status(500).json({ message: "Internal server error.", status: "Error" })
    }
}

const getOneRole = async (req, res) => {
    try {
        const result = await roleService.getOneRole(req.params.id)
        if (!result) return res.status(404).json({ message: "Role not found.", status: "Error" })
        return res.status(200).json({ data: result, message: "Role fetched successfully.", status: "Success" })
    } catch (error) {
        console.error("Error - getOneRole controller:", error)
        return res.status(500).json({ message: "Internal server error.", status: "Error" })
    }
}

const updateRole = async (req, res) => {
    try {
        const result = await roleService.updateRole(req.params.id, req.body)
        if (!result.status) return res.status(400).json({ message: result.msg, status: "Error" })
        return res.status(200).json({ data: result.data, message: "Role updated successfully.", status: "Success" })
    } catch (error) {
        console.error("Error - updateRole controller:", error)
        return res.status(500).json({ message: "Internal server error.", status: "Error" })
    }
}

const deleteRole = async (req, res) => {
    try {
        const result = await roleService.deleteRole(req.params.id)
        if (!result.status) return res.status(400).json({ message: result.msg, status: "Error" })
        return res.status(200).json({ message: result.msg, status: "Success" })
    } catch (error) {
        console.error("Error - deleteRole controller:", error)
        return res.status(500).json({ message: "Internal server error.", status: "Error" })
    }
}

module.exports = { createRole, getAllRoles, getOneRole, updateRole, deleteRole }
