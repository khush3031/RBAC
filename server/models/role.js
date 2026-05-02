const mongoose = require("mongoose")

const schema = mongoose.Schema(
    {
        name: { type: String, unique: true, trim: true },
        code: { type: String, unique: true, uppercase: true, trim: true, index: true },
        description: { type: String, trim: true },
        permissions: [{ type: String, trim: true, lowercase: true }]
    },
    { timestamps: true }
)

module.exports = mongoose.model("role", schema, "role")