// src/api/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3001/api', // Bütün sorğuların başına bu prefiks əlavə olunacaq
});

// Bu, hər sorğu göndərilməzdən ƏVVƏL işə düşən bir funksiyadır
api.interceptors.request.use(
    (config) => {
        // localStorage-dan istifadəçi məlumatını götürürük
        const user = JSON.parse(localStorage.getItem('user'));

        // Əgər istifadəçi və onun tokeni varsa...
        if (user && user.token) {
            // Sorğunun başlığına (header) Authorization əlavə edirik
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;