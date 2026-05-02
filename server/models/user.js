const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const schema = mongoose.Schema(
    {
        name: { type: String, trim: true },
        email: { type: String, unique: true, lowercase: true, trim: true },
        password: { type: String, select: false },
        role: { type: mongoose.Schema.Types.ObjectId, ref: "role" },
        isActive: { type: Boolean, default: true },
        token: { type: String, select: false }
    },
    { timestamps: true }
)

schema.pre("save", async function () {
    if (!this.isModified("password")) return
    this.password = await bcrypt.hash(this.password, parseInt(process.env.BCRYPT_SALT) || 10)
})

schema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

module.exports = mongoose.model("user", schema, "user")