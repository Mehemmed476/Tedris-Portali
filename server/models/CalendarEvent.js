import mongoose from 'mongoose';
const CalendarEventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    date: { type: String, required: true },
    type: { type: String, enum: ['test', 'holiday', 'meeting', 'other'], default: 'other' },
    classId: { type: mongoose.Schema.ObjectId, ref: 'Class', required: true },
    teacherId: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
}, { timestamps: true });
export default mongoose.model('CalendarEvent', CalendarEventSchema);