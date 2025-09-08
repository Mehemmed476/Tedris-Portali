import mongoose from 'mongoose';
const UserSchema = new mongoose.Schema({
    email: { type: String, required: [true, 'Zəhmət olmasa, email daxil edin'], unique: true, match: [ /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Zəhmət olmasa, düzgün email formatı daxil edin' ] },
    password: { type: String, required: [true, 'Zəhmət olmasa, şifrə daxil edin'], minlength: 6, select: false },
    role: { type: String, enum: ['muellim', 'valideyn'], required: true },
    linkedStudentId: { type: mongoose.Schema.ObjectId, ref: 'Student', }
}, { timestamps: true });
export default mongoose.model('User', UserSchema);