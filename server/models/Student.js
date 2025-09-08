import mongoose from 'mongoose';
const StudentSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'Şagirdin adı daxil edilməlidir'], },
    classId: { type: mongoose.Schema.ObjectId, ref: 'Class', required: true, },
    teacherId: { type: mongoose.Schema.ObjectId, ref: 'User', required: true, },
    parentUid: { type: mongoose.Schema.ObjectId, ref: 'User', },
    parentInviteCode: { type: String, unique: true, sparse: true },
    studentInviteCode: { type: String, unique: true, sparse: true },
}, { timestamps: true });
export default mongoose.model('Student', StudentSchema);