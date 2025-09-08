import Student from '../models/Student.js';
import Class from '../models/Class.js';
import { generateUniqueCode } from '../utils/codeGenerator.js';

export const getStudentsByClass = async (req, res) => {
    try {
        const aClass = await Class.findById(req.params.classId);
        if (!aClass || aClass.teacherId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'İcazə yoxdur' });
        }
        const students = await Student.find({ classId: req.params.classId }).sort({ createdAt: 'asc' });
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: "Server xətası", error: error.message });
    }
};

export const createStudent = async (req, res) => {
    const { name, classId } = req.body;
    try {
        const aClass = await Class.findById(classId);
        if (!aClass || aClass.teacherId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'İcazə yoxdur' });
        }
        const parentCode = await generateUniqueCode('VAL', 'parentInviteCode');
        const studentCode = await generateUniqueCode('SAG', 'studentInviteCode');
        const newStudent = await Student.create({
            name,
            classId,
            teacherId: req.user.id,
            parentInviteCode: parentCode,
            studentInviteCode: studentCode,
        });
        res.status(201).json(newStudent);
    } catch (error) {
        res.status(500).json({ message: "Server xətası", error: error.message });
    }
};

export const updateStudent = async (req, res) => {
    const { name } = req.body;
    try {
        const student = await Student.findById(req.params.id);
        if (!student || student.teacherId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'İcazə yoxdur' });
        }
        student.name = name;
        const updatedStudent = await student.save();
        res.status(200).json(updatedStudent);
    } catch (error) {
        res.status(500).json({ message: "Server xətası", error: error.message });
    }
};

export const deleteStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student || student.teacherId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'İcazə yoxdur' });
        }
        await student.deleteOne();
        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: "Server xətası", error: error.message });
    }
};

export const getStudentDetails = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id).populate('parentUid', 'email');
        if (!student || student.teacherId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'İcazə yoxdur' });
        }
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ message: "Server xətası" });
    }
};