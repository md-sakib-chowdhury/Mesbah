// import axios from 'axios';

// const API = axios.create({
//     // এখানে আপনার প্রজেক্টের পুরো নামসহ লিঙ্কটি দিতে হবে
//     baseURL: 'https://mesbah-efvg.onrender.com/api',
// });

// // টোকেন অটোমেটিক পাঠানোর জন্য এই অংশটুকু
// API.interceptors.request.use((req) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//         req.headers.Authorization = `Bearer ${token}`;
//     }
//     return req;
// });

// export default API;
import axios from 'axios';

const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
});

API.interceptors.request.use(req => {
    const token = localStorage.getItem('token');
    if (token) req.headers.Authorization = `Bearer ${token}`;
    return req;
});

export default API;
