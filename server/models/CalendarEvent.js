// server/models/CalendarEvent.js
const mongoose = require('mongoose');
const CalendarEventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    date: { type: String, required: true }, // Format: "YYYY-MM-DD"
    type: { type: String, enum: ['test', 'holiday', 'meeting', 'other'], default: 'other' },
    classId: { type: mongoose.Schema.ObjectId, ref: 'Class', required: true },
    teacherId: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
}, { timestamps: true });
module.exports = mongoose.model('CalendarEvent', CalendarEventSchema);