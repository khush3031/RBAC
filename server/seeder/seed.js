const Permission = require("../models/permission")
const Role = require("../models/role")
const User = require("../models/user")

/**
 * Seed all permissions from permission.json
 */
const seedPermissions = async () => {
    try {
        const permissions = require("./permission.json")
        await Promise.all(
            permissions.map((p) =>
                Permission.findOneAndUpdate(
                    { key: p.key },
                    p,
                    { upsert: true, new: true, setDefaultsOnInsert: true }
                )
            )
        )
        console.log(`✅ Seeded ${permissions.length} permissions`)
    } catch (error) {
        console.error("❌ Error - seedPermissions:", error.message)
        throw error
    }
}

/**
 * Seed roles from roles.json
 * Runs AFTER permissions so validation logic in service layer works
 */
const seedRoles = async () => {
    try {
        const roleList = require("./roles.json")
        await Promise.all(
            roleList.map((r) =>
                Role.findOneAndUpdate(
                    { code: r.code },
                    r,
                    { upsert: true, new: true, setDefaultsOnInsert: true }
                )
            )
        )
        console.log(`✅ Seeded ${roleList.length} roles`)
    } catch (error) {
        console.error("❌ Error - seedRoles:", error.message)
        throw error
    }
}

/**
 * Seed admin user(s) from admin.json
 * Uses User.create to trigger pre-save bcrypt hook for password hashing.
 * Skips if admin already exists.
 */
const seedAdmin = async () => {
    try {
        const adminUsers = require("./admin.json")
        await Promise.all(
            adminUsers.map(async (usr) => {
                const existing = await User.findOne({ email: usr.email.toLowerCase() })
                if (existing) {
                    console.log(`⏭️  Admin user already exists: ${usr.email}`)
                    return
                }
                const role = await Role.findOne({ code: usr.role.toUpperCase() })
                if (!role) {
                    console.error(`❌ Role not found for admin: ${usr.role}`)
                    return
                }
                await User.create({
                    name: usr.name,
                    email: usr.email.toLowerCase(),
                    password: usr.password, // pre-save hook hashes this
                    role: role._id
                })
                console.log(`✅ Admin user created: ${usr.email}`)
            })
        )
    } catch (error) {
        console.error("❌ Error - seedAdmin:", error.message)
        throw error
    }
}

/**
 * Master seeder — runs in order: permissions → roles → admin users
 */
const seedData = async () => {
    try {
        await seedPermissions()
        await seedRoles()
        await seedAdmin()
        console.log("🌱 Seeding complete.")
    } catch (error) {
        console.error("❌ Seeding failed:", error.message)
    }
}

module.exports = seedData