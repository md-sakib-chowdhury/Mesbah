import axios from 'axios';

const API = axios.create({
    // এটি আপনার রেন্ডার ব্যাকেন্ডের সঠিক ঠিকানা
    baseURL: 'https://onrender.com',
});

// টোকেন অটোমেটিক পাঠানোর জন্য এই অংশটুকু
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;