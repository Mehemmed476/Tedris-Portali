// server/models/Student.js
const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Şagirdin adı daxil edilməlidir'],
    },
    classId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Class', // Class modeli ilə əlaqə
        required: true,
    },
    teacherId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User', // User modeli ilə əlaqə (müəllim)
        required: true,
    },
    parentUid: {
        type: mongoose.Schema.ObjectId,
        ref: 'User', // User modeli ilə əlaqə (valideyn)
    },
    parentInviteCode: { type: String, unique: true },
    studentInviteCode: { type: String, unique: true },
}, {
    timestamps: true
});

module.exports = mongoose.model('Student', StudentSchema);