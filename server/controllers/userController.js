import User from '../models/User.js';
import Student from '../models/Student.js';

export const linkParentAccount = async (req, res) => {
    const { inviteCode } = req.body;
    const parentUserId = req.user.id;
    try {
        const student = await Student.findOne({ parentInviteCode: inviteCode });
        if (!student) { return res.status(404).json({ message: 'Daxil edilən kod səhvdir' }); }
        if (student.parentUid) { return res.status(400).json({ message: 'Bu dəvət kodu artıq istifadə olunub' }); }
        
        student.parentUid = parentUserId;
        student.parentInviteCode = null;
        await student.save();

        const updatedUser = await User.findByIdAndUpdate(parentUserId, { linkedStudentId: student._id }, { new: true });
        res.status(200).json({ message: 'Hesab uğurla bağlandı!', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Server xətası', error: error.message });
    }
};