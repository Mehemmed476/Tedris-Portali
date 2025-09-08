import Announcement from '../models/Announcement.js';
import Class from '../models/Class.js';

export const getAnnouncementsByClass = async (req, res) => {
    try {
        const aClass = await Class.findById(req.params.classId);
        if (!aClass || aClass.teacherId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'İcazə yoxdur' });
        }
        const announcements = await Announcement.find({ classId: req.params.classId }).sort({ createdAt: -1 });
        res.status(200).json(announcements);
    } catch (error) { res.status(500).json({ message: "Server xətası" }); }
};

export const createAnnouncement = async (req, res) => {
    const { text, classId } = req.body;
    try {
        const aClass = await Class.findById(classId);
        if (!aClass || aClass.teacherId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'İcazə yoxdur' });
        }
        const announcement = await Announcement.create({ text, classId, teacherId: req.user.id });
        res.status(201).json(announcement);
    } catch (error) { res.status(500).json({ message: "Server xətası" }); }
};