import CalendarEvent from '../models/CalendarEvent.js';
import Class from '../models/Class.js';

export const getEventsByClass = async (req, res) => {
    try {
        const aClass = await Class.findById(req.params.classId);
        if (!aClass || aClass.teacherId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'İcazə yoxdur' });
        }
        const events = await CalendarEvent.find({ classId: req.params.classId });
        res.status(200).json(events);
    } catch (error) { res.status(500).json({ message: "Server xətası" }); }
};

export const createEvent = async (req, res) => {
    const { title, date, type, classId } = req.body;
    try {
        const aClass = await Class.findById(classId);
        if (!aClass || aClass.teacherId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'İcazə yoxdur' });
        }
        const event = await CalendarEvent.create({ title, date, type, classId, teacherId: req.user.id });
        res.status(201).json(event);
    } catch (error) { res.status(500).json({ message: "Server xətası" }); }
};