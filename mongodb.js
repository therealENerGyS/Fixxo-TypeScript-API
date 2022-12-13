const mongoose = require('mongoose')

const initMongoDB = async () => {
    const conn = await mongoose.connect(process.env.MONGODB_URI)
    console.log(`MongoDB is Running at ${conn.connection.host}`)
}

module.exports = initMongoDB