// src/utils/translation.js

const attendanceMap = {
    present: 'İştirak etdi',
    absent: 'Qayıb',
    late: 'Gecikdi',
};

export const translateAttendance = (status) => {
    return attendanceMap[status] || status; // Tərcüməni tapır, tapmasa, orijinal sözü qaytarır
};