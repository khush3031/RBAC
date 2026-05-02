const mongoose = require("mongoose")

const schema = mongoose.Schema(
    {
        key: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            index: true
        },
        name: { type: String, trim: true },
        module: { type: String, trim: true },
        description: { type: String, trim: true }
    },
    { timestamps: true }
)

module.exports = mongoose.model("Permission", schema, "Permission")
