// server/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`[db] MongoDB uğurla qoşuldu: ${conn.connection.host}`);
    } catch (error) {
        console.error(`[db] Xəta: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;