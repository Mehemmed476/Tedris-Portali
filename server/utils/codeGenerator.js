// server/utils/codeGenerator.js
const Student = require('../models/Student');

const makeChunk = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
};

const generateUniqueCode = async (prefix, fieldName) => {
    for (let i = 0; i < 10; i++) { // Maksimum 10 cəhd
        const candidate = `${prefix}-${makeChunk()}`;

        const query = { [fieldName]: candidate };
        const existing = await Student.findOne(query);

        if (!existing) {
            return candidate; // Unikaldırsa, qaytar
        }
    }
    // Əgər 10 cəhddə də unikal kod tapılmasa, xəta ver
    throw new Error(`Unikal ${fieldName} yaradıla bilmədi.`);
};

module.exports = { generateUniqueCode };