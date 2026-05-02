const mongoose = require("mongoose")

const connectDb = async() => {
    try {
        const con = await mongoose.connect(process.env.MONGO_URI)

        console.log(`c: ${con.connection.host}`)
    } catch (error) {
        console.log("Error: ", error.message)
        process.exit(1)
    }
}

module.exports = connectDb