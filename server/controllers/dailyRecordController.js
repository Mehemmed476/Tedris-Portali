const DailyRecord = require('../models/DailyRecord');
const Class = require('../models/Class');
const Student = require('../models/Student');

const getRecordByDate = async (req, res) => {
    try {
        const aClass = await Class.findById(req.params.classId);
        if (!aClass || aClass.teacherId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'İcazə yoxdur' });
        }
        const record = await DailyRecord.findOne({
            classId: req.params.classId,
            date: req.params.date,
        }).populate('questions.studentId', 'name');
        
        if (!record) { return res.status(200).json(null); }
        res.status(200).json(record);
    } catch (error) { res.status(500).json({ message: "Server xətası" }); }
};

const upsertRecord = async (req, res) => {
    const { classId, date, homework, attendance, grades, event, testResults } = req.body;
    try {
        const aClass = await Class.findById(classId);
        if (!aClass || aClass.teacherId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'İcazə yoxdur' });
        }
        const record = await DailyRecord.findOneAndUpdate(
            { classId, date },
            { teacherId: req.user.id, homework, attendance, grades, event, testResults },
            { new: true, upsert: true, runValidators: true }
        );
        res.status(200).json(record);
    } catch (error) { res.status(500).json({ message: "Server xətası" }); }
};

const askQuestion = async (req, res) => {
    // --- DƏYİŞİKLİK BURADADIR ---
    const { classId, date, questionTitle, questionDescription } = req.body;
    const studentId = req.user.id;

    try {
        const student = await Student.findById(studentId);
        if (!student || student.classId.toString() !== classId) {
            return res.status(403).json({ message: "İcazə yoxdur" });
        }

        let record = await DailyRecord.findOne({ classId, date });
        if (!record) {
            const aClass = await Class.findById(classId);
            record = await DailyRecord.create({ classId, date, teacherId: aClass.teacherId });
        }
        
        record.questions.push({ studentId, questionTitle, questionDescription });
        await record.save();

        // Cavab olaraq populate edilmiş son halını qaytaraq
        const populatedRecord = await record.populate('questions.studentId', 'name');
        res.status(201).json(populatedRecord);

    } catch (error) {
        res.status(500).json({ message: "Server xətası" });
    }
};

module.exports = { getRecordByDate, upsertRecord, askQuestion };