import mongoose from 'mongoose';
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`[db] MongoDB uğurla qoşuldu: ${conn.connection.host}`);
    } catch (error) {
        console.error(`[db] Xəta: ${error.message}`);
        process.exit(1);
    }
};
export default connectDB;