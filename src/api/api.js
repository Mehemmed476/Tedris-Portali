import axios from 'axios';

const api = axios.create({
    // DÜZƏLİŞ 1: Ehtiyat (fallback) URL əlavə edildi
    baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api`,
});

api.interceptors.request.use(
    (config) => {
        try {
            // DÜZƏLİŞ 2: Əməliyyat təhlükəsiz try...catch bloku içinə alındı
            const user = JSON.parse(localStorage.getItem('user'));
            if (user && user.token) {
                config.headers.Authorization = `Bearer ${user.token}`;
            }
        } catch (error) {
            console.error("localStorage-dan istifadəçi məlumatını oxumaq mümkün olmadı:", error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;