// server/controllers/uploadController.js
const cloudinary = require('cloudinary').v2;
const DailyRecord = require('../models/DailyRecord');
const Class = require('../models/Class');
const fs = require('fs');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadFile = async (req, res) => {
    const { classId, date } = req.body;
    
    if (!req.file) {
        return res.status(400).json({ message: 'Fayl seçilməyib' });
    }

    try {
        const aClass = await Class.findById(classId);
        if (!aClass || aClass.teacherId.toString() !== req.user.id) {
            fs.unlinkSync(req.file.path);
            return res.status(401).json({ message: 'İcazə yoxdur' });
        }

        // --- DƏYİŞİKLİK: ƏVVƏLKİ SADƏ VERSİYAYA QAYITDIQ ---
        // Faylı yükləyirik, Cloudinary özü unikal ad verir
        const result = await cloudinary.uploader.upload(req.file.path, {
            resource_type: "auto",
            folder: `tedris-portali/${classId}`
        });
        
        fs.unlinkSync(req.file.path);

        let record = await DailyRecord.findOne({ classId, date });
        if (!record) {
            record = await DailyRecord.create({ classId, date, teacherId: req.user.id });
        }

        const newAttachment = {
            url: result.secure_url,
            public_id: result.public_id,
            original_filename: req.file.originalname, // Multer-dən gələn orijinal adı (uzantısı ilə birlikdə) saxlayırıq
        };
        record.attachments.push(newAttachment);
        await record.save();

        res.status(201).json(newAttachment);

    } catch (error) {
        console.error("FAYL YÜKLƏMƏ XƏTASI:", error); // Xətanı daha aydın görmək üçün
        res.status(500).json({ message: 'Fayl yüklənərkən xəta baş verdi' });
    }
};

module.exports = { uploadFile };