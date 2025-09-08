import User from '../models/User.js';
import Student from '../models/Student.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
    const { email, password, role } = req.body;
    if (!email || !password || !role) { return res.status(400).json({ message: 'Zəhmət olmasa, bütün sahələri doldurun' }); }
    try {
        const userExists = await User.findOne({ email });
        if (userExists) { return res.status(400).json({ message: 'Bu email artıq istifadə olunub' }); }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({ email, password: hashedPassword, role });
        if (user) {
            const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '30d' });
            res.status(201).json({ _id: user._id, email: user.email, role: user.role, token: token, linkedStudentId: user.linkedStudentId || null });
        } else { res.status(400).json({ message: 'İstifadəçi yaradıla bilmədi' }); }
    } catch (error) { res.status(500).json({ message: 'Server xətası', error: error.message }); }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) { return res.status(400).json({ message: 'Email və şifrə daxil edilməlidir' }); }
    try {
        const user = await User.findOne({ email }).select('+password');
        if (!user) { return res.status(401).json({ message: 'Email və ya şifrə səhvdir' }); }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) { return res.status(401).json({ message: 'Email və ya şifrə səhvdir' }); }
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '30d' });
        res.status(200).json({ _id: user._id, email: user.email, role: user.role, token: token, linkedStudentId: user.linkedStudentId || null });
    } catch (error) { res.status(500).json({ message: 'Server xətası', error: error.message }); }
};

export const loginStudent = async (req, res) => {
    const { inviteCode } = req.body;
    if (!inviteCode) { return res.status(400).json({ message: 'Dəvət kodu daxil edilməlidir' }); }
    try {
        const student = await Student.findOne({ studentInviteCode: inviteCode });
        if (!student) { return res.status(401).json({ message: 'Dəvət kodu səhvdir' }); }
        const token = jwt.sign({ id: student._id, role: 'student' }, process.env.JWT_SECRET, { expiresIn: '30d' });
        res.status(200).json({ _id: student._id, name: student.name, role: 'student', token: token, classId: student.classId });
    } catch (error) { res.status(500).json({ message: 'Server xətası', error: error.message }); }
};