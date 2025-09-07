// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Student = require('../models/Student'); // Student modelini import edirik

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // --- ƏSAS DƏYİŞİKLİK BURADADIR ---
            // Tokenin içindəki rola baxırıq
            if (decoded.role === 'student') {
                // Əgər rolu "student"-dirsə, onu "students" kolleksiyasından axtarırıq
                req.user = await Student.findById(decoded.id);
                // req.user obyektinə rolunu da əlavə edirik ki, sonrakı mərhələlərdə istifadə edə bilək
                if(req.user) req.user.role = 'student';
            } else {
                // Əgər rol "muellim" və ya "valideyn"-dirsə, onu "users" kolleksiyasından axtarırıq
                req.user = await User.findById(decoded.id).select('-password');
            }
            // ------------------------------------

            if (!req.user) {
                return res.status(401).json({ message: 'İcazə yoxdur, istifadəçi tapılmadı' });
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Giriş üçün icazə yoxdur, token səhvdir' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Giriş üçün icazə yoxdur, token tapılmadı' });
    }
};

module.exports = { protect };