const jwt = require("jsonwebtoken")

const generateToken = async(data) => {
    try {
        return await jwt.sign({ id: data._id, email: data.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES })
    } catch (error) {
        console.error("Error - generateToken ", error)
        throw new Error(error)
    }
}

module.exports = {
    generateToken
}