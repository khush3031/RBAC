const Role = require("../models/role")
const Permission = require("../models/permission")

/**
 * Validate that all given permission keys exist in the DB
 */
const validatePermissions = async (permissionKeys) => {
    if (!permissionKeys || permissionKeys.length === 0) return { valid: true, invalid: [] }
    const existing = await Permission.find({ key: { $in: permissionKeys } }).select("key")
    const existingKeys = existing.map((p) => p.key)
    const invalid = permissionKeys.filter((k) => !existingKeys.includes(k))
    return { valid: invalid.length === 0, invalid }
}

/**
 * Create a new role
 */
const createRole = async (data) => {
    try {
        const exists = await Role.findOne({ code: data.code?.toUpperCase() })
        if (exists) return { status: false, msg: "Role with this code already exists." }

        const permKeys = (data.permissions || []).map((p) => p.toLowerCase())
        const { valid, invalid } = await validatePermissions(permKeys)
        if (!valid) return { status: false, msg: `Invalid permission keys: ${invalid.join(", ")}` }

        const role = await Role.create({
            name: data.name,
            code: data.code.toUpperCase(),
            description: data.description,
            permissions: permKeys
        })

        return { data: role, status: true }
    } catch (error) {
        console.error("Error - createRole service:", error)
        throw new Error(error)
    }
}

/**
 * Get all roles
 */
const getAllRoles = async () => {
    try {
        return await Role.find().sort({ createdAt: -1 })
    } catch (error) {
        console.error("Error - getAllRoles service:", error)
        throw new Error(error)
    }
}

/**
 * Get one role by ID
 */
const getOneRole = async (id) => {
    try {
        const role = await Role.findById(id)
        if (!role) return null
        return role
    } catch (error) {
        console.error("Error - getOneRole service:", error)
        throw new Error(error)
    }
}

/**
 * Update a role
 */
const updateRole = async (id, data) => {
    try {
        const role = await Role.findById(id)
        if (!role) return { status: false, msg: "Role not found." }

        if (data.permissions) {
            const permKeys = data.permissions.map((p) => p.toLowerCase())
            const { valid, invalid } = await validatePermissions(permKeys)
            if (!valid) return { status: false, msg: `Invalid permission keys: ${invalid.join(", ")}` }
            data.permissions = permKeys
        }

        if (data.code) data.code = data.code.toUpperCase()

        const updated = await Role.findByIdAndUpdate(id, data, { new: true })
        return { data: updated, status: true }
    } catch (error) {
        console.error("Error - updateRole service:", error)
        throw new Error(error)
    }
}

/**
 * Delete a role
 */
const deleteRole = async (id) => {
    try {
        const role = await Role.findById(id)
        if (!role) return { status: false, msg: "Role not found." }
        // Prevent deleting the ADMIN role
        if (role.code === "ADMIN") return { status: false, msg: "Cannot delete the ADMIN role." }
        await Role.deleteOne({ _id: id })
        return { status: true, msg: "Role deleted successfully." }
    } catch (error) {
        console.error("Error - deleteRole service:", error)
        throw new Error(error)
    }
}

module.exports = { createRole, getAllRoles, getOneRole, updateRole, deleteRole }
