import DailyRecord from '../models/DailyRecord.js';
import Class from '../models/Class.js';
import Student from '../models/Student.js';

export const getRecordByDate = async (req, res) => {
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

export const upsertRecord = async (req, res) => {
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

export const askQuestion = async (req, res) => {
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
        const savedRecord = await record.save();
        const populatedRecord = await savedRecord.populate('questions.studentId', 'name');
        res.status(201).json(populatedRecord);
    } catch (error) {
        res.status(500).json({ message: "Server xətası" });
    }
};

export const answerQuestion = async (req, res) => {
    const { recordId, questionId, answerText } = req.body;
    try {
        const record = await DailyRecord.findById(recordId).populate('questions.studentId', 'name');
        if (!record || record.teacherId.toString() !== req.user.id) {
            return res.status(401).json({ message: "İcazə yoxdur" });
        }
        const question = record.questions.id(questionId);
        if (!question) { return res.status(404).json({ message: "Sual tapılmadı" }); }
        question.answerText = answerText;
        await record.save();
        res.status(200).json(record);
    } catch (error) { res.status(500).json({ message: "Server xətası" }); }
};