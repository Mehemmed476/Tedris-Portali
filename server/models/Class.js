const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
    className: {
        type: String,
        required: [true, 'Sinif adı daxil edilməlidir'],
    },
    teacherId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User', // Bu, User modeli ilə əlaqə qurur
        required: true,
    },
    days: {
        type: [String], // ["Bazar ertəsi", "Çərşənbə"] kimi
    },
    time: {
        type: String, // "19:00" kimi
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Class', ClassSchema);