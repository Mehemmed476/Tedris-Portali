const mongoose = require('mongoose');

const DailyRecordSchema = new mongoose.Schema({
    date: { type: String, required: true },
    classId: { type: mongoose.Schema.ObjectId, ref: 'Class', required: true },
    teacherId: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    homework: { type: String, default: '' },
    event: {
        title: { type: String },
        type: { type: String, enum: ['test', 'holiday', 'meeting', 'other'], default: 'other' }
    },
    testResults: { type: Map, of: Number },
    attendance: { type: Map, of: String },
    grades: { type: Map, of: mongoose.Schema.Types.Mixed },
    questions: [
        {
            studentId: { type: mongoose.Schema.ObjectId, ref: 'Student', required: true },
            questionTitle: { type: String, required: true, trim: true },
            questionDescription: { type: String, required: true, trim: true },
            answerText: { type: String },
            askedAt: { type: Date, default: Date.now }
        }
    ],
    attachments: [
        {
            url: { type: String, required: true },
            public_id: { type: String, required: true },
            original_filename: { type: String }
        }
    ]
}, { timestamps: true });

DailyRecordSchema.index({ classId: 1, date: 1 }, { unique: true });
module.exports = mongoose.model('DailyRecord', DailyRecordSchema);