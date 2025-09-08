import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Student from '../models/Student.js';
export const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (decoded.role === 'student') {
                req.user = await Student.findById(decoded.id);
                if(req.user) req.user.role = 'student';
            } else {
                req.user = await User.findById(decoded.id).select('-password');
            }
            if (!req.user) { return res.status(401).json({ message: 'İcazə yoxdur, istifadəçi tapılmadı' }); }
            next();
        } catch (error) { res.status(401).json({ message: 'Giriş üçün icazə yoxdur, token səhvdir' }); }
    }
    if (!token) { res.status(401).json({ message: 'Giriş üçün icazə yoxdur, token tapılmadı' }); }
};