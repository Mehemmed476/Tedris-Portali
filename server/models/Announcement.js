// server/models/Announcement.js
const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, 'Elan mətni boş ola bilməz'],
    },
    classId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Class',
        required: true,
    },
    teacherId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Announcement', AnnouncementSchema);