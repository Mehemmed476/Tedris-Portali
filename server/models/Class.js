import mongoose from 'mongoose';
const ClassSchema = new mongoose.Schema({
    className: { type: String, required: [true, 'Sinif adı daxil edilməlidir'], },
    teacherId: { type: mongoose.Schema.ObjectId, ref: 'User', required: true, },
    days: { type: [String], },
    time: { type: String, },
}, { timestamps: true });
export default mongoose.model('Class', ClassSchema);