// server/controllers/userController.js
const User = require('../models/User');
const Student = require('../models/Student');

// @desc    Valideyn hesabını dəvət kodu ilə şagirdə bağlayır
// @route   POST /api/users/link-account
const linkParentAccount = async (req, res) => {
    const { inviteCode } = req.body;
    const parentUserId = req.user.id; // Bu, "protect" middleware-dən gəlir

    try {
        // 1. Dəvət koduna uyğun şagirdi tapırıq
        const student = await Student.findOne({ parentInviteCode: inviteCode });

        if (!student) {
            return res.status(404).json({ message: 'Daxil edilən kod səhvdir' });
        }
        if (student.parentUid) {
            return res.status(400).json({ message: 'Bu dəvət kodu artıq istifadə olunub' });
        }

        // 2. Şagird sənədini yeniləyirik
        student.parentUid = parentUserId;
        student.parentInviteCode = null; // Kodu birdəfəlik edirik
        await student.save();

        // 3. Valideynin öz sənədini yeniləyirik
        const updatedUser = await User.findByIdAndUpdate(parentUserId, { linkedStudentId: student._id }, { new: true });

        res.status(200).json({ message: 'Hesab uğurla bağlandı!', user: updatedUser });

    } catch (error) {
        res.status(500).json({ message: 'Server xətası', error: error.message });
    }
};

module.exports = { linkParentAccount };