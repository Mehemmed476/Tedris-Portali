import Student from '../models/Student.js';
import Class from '../models/Class.js';
import User from '../models/User.js';
import Announcement from '../models/Announcement.js';
import DailyRecord from '../models/DailyRecord.js';
import CalendarEvent from '../models/CalendarEvent.js';

export const getParentDashboardData = async (req, res) => {
    try {
        const parentUser = req.user;
        if (parentUser.role !== 'valideyn' || !parentUser.linkedStudentId) {
            return res.status(403).json({ message: 'Bu əməliyyat üçün icazəniz yoxdur' });
        }
        const student = await Student.findById(parentUser.linkedStudentId);
        if (!student) { return res.status(404).json({ message: 'Bağlı şagird tapılmadı' }); }
        
        const [classData, teacher, announcements, dailyRecords, events] = await Promise.all([
            Class.findById(student.classId),
            User.findById(student.teacherId).select('email'),
            Announcement.find({ classId: student.classId }).sort({ createdAt: -1 }).limit(10),
            DailyRecord.find({ classId: student.classId }).sort({ date: -1 }).populate('questions.studentId', 'name'),
            CalendarEvent.find({ classId: student.classId })
        ]);
        
        const studentSpecificRecords = dailyRecords.map(record => {
            const studentIdStr = student._id.toString();
            const attendance = record.attendance?.get(studentIdStr);
            const grades = record.grades?.get(studentIdStr);
            const testResults = record.testResults?.get(studentIdStr);
            const studentQuestions = record.questions.filter(q => q.studentId._id.toString() === studentIdStr);
            if (attendance || grades || testResults || studentQuestions.length > 0 || record.attachments?.length > 0) {
                return {
                    date: record.date, dailyHomeworkText: record.homework,
                    grades: { homework: grades?.homework?.score ?? null, activity: grades?.activity ?? null, discipline: grades?.discipline ?? null, },
                    attendance: attendance, testResults: testResults ?? null,
                    questions: studentQuestions, attachments: record.attachments,
                };
            }
            return null;
        }).filter(Boolean);

        res.status(200).json({ student, classData, teacher, announcements, dailyRecords: studentSpecificRecords, events });
    } catch (error) { res.status(500).json({ message: "Server xətası", error: error.message }); }
};

export const getStudentDashboardData = async (req, res) => {
    try {
        const student = await Student.findById(req.user.id);
        if (!student) { return res.status(404).json({ message: 'Şagird profili tapılmadı' }); }
        
        const [classData, teacher, announcements, dailyRecords, events] = await Promise.all([
            Class.findById(student.classId),
            User.findById(student.teacherId).select('email'),
            Announcement.find({ classId: student.classId }).sort({ createdAt: -1 }).limit(10),
            DailyRecord.find({ classId: student.classId }).sort({ date: -1 }).populate('questions.studentId', 'name'),
            CalendarEvent.find({ classId: student.classId })
        ]);
        
        const studentSpecificRecords = dailyRecords.map(record => {
            const studentIdStr = student._id.toString();
            const attendance = record.attendance?.get(studentIdStr);
            const grades = record.grades?.get(studentIdStr);
            const testResults = record.testResults?.get(studentIdStr);
            const studentQuestions = record.questions.filter(q => q.studentId._id.toString() === studentIdStr);
            
            if (attendance || grades || testResults || studentQuestions.length > 0 || record.attachments?.length > 0) {
                return {
                    date: record.date, dailyHomeworkText: record.homework,
                    grades: { homework: grades?.homework?.score ?? null, activity: grades?.activity ?? null, discipline: grades?.discipline ?? null, },
                    attendance: attendance, testResults: testResults ?? null,
                    questions: studentQuestions, attachments: record.attachments,
                };
            }
            return null;
        }).filter(Boolean);

        res.status(200).json({ student, classData, teacher, announcements, dailyRecords: studentSpecificRecords, events });
    } catch (error) { res.status(500).json({ message: "Server xətası", error: error.message }); }
};