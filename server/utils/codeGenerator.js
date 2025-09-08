import Student from '../models/Student.js';
const makeChunk = () => { return Math.random().toString(36).substring(2, 8).toUpperCase(); };
export const generateUniqueCode = async (prefix, fieldName) => {
    for (let i = 0; i < 10; i++) {
        const candidate = `${prefix}-${makeChunk()}`;
        const query = { [fieldName]: candidate };
        const existing = await Student.findOne(query);
        if (!existing) { return candidate; }
    }
    throw new Error(`Unikal ${fieldName} yaradıla bilmədi.`);
};