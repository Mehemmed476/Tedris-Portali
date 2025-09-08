import Class from '../models/Class.js';
import Student from '../models/Student.js';
import Announcement from '../models/Announcement.js';

export const getClasses = async (req, res) => {
    try {
        const classes = await Class.find({ teacherId: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(classes);
    } catch (error) {
        res.status(500).json({ message: "Server xətası", error: error.message });
    }
};

export const createClass = async (req, res) => {
    const { className, days, time } = req.body;
    if (!className || !days || days.length === 0 || !time) {
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

export const deleteClass = async (req, res) => {
    try {
        const aClass = await Class.findById(req.params.id);
        if (!aClass || aClass.teacherId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'İcazə yoxdur' });
        }
        await Student.deleteMany({ classId: req.params.id });
        await Announcement.deleteMany({ classId: req.params.id });
        await aClass.deleteOne();
        res.status(200).json({ id: req.params.id, message: 'Sinif uğurla silindi' });
    } catch (error) {
        res.status(500).json({ message: "Server xətası", error: error.message });
    }
};