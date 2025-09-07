// server/controllers/classController.js
const Class = require('../models/Class');
const Student = require('../models/Student');
const Announcement = require('../models/Announcement');

const getClasses = async (req, res) => {
    try {
        const classes = await Class.find({ teacherId: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(classes);
    } catch (error) {
        res.status(500).json({ message: "Server xətası", error: error.message });
    }
};

const createClass = async (req, res) => {
    const { className, days, time } = req.body;
    if (!className || days.length === 0 || !time) {
        return res.status(400).json({ message: "Bütün sahələri doldurun" });
    }
    try {
        const newClass = await Class.create({
            className,
            days,
            time,
            teacherId: req.user.id,
        });
        res.status(201).json(newClass);
    } catch (error) {
        res.status(500).json({ message: "Server xətası", error: error.message });
    }
};

// --- YENİ FUNKSİYA ---
// @desc    Bir sinifi və ona bağlı hər şeyi silir
// @route   DELETE /api/classes/:id
const deleteClass = async (req, res) => {
    try {
        const aClass = await Class.findById(req.params.id);

        // Təhlükəsizlik yoxlaması: Yalnız sinfin öz müəllimi onu silə bilər
        if (!aClass || aClass.teacherId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'İcazə yoxdur' });
        }

        // Sinifə bağlı hər şeyi silirik
        await Student.deleteMany({ classId: req.params.id });
        await Announcement.deleteMany({ classId: req.params.id });
        // Gələcəkdə DailyRecord modelini də bura əlavə edəcəyik

        // Ən sonda sinfin özünü silirik
        await aClass.deleteOne();

        res.status(200).json({ id: req.params.id, message: 'Sinif uğurla silindi' });

    } catch (error) {
        res.status(500).json({ message: "Server xətası", error: error.message });
    }
};

module.exports = {
    getClasses,
    createClass,
    deleteClass, // Yeni funksiyanı export edirik
};