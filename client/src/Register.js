import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';

export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '', university: '', phone: '', gender: 'male' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleRegister = async () => {
        setLoading(true); setError('');
        try {
            const res = await API.post('/auth/register', form);
            login(res.data.user, res.data.token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally { setLoading(false); }
    };

    const inputStyle = { width: '100%', padding: '12px 16px', border: '1.5px solid #E2E8F0', borderRadius: 10, fontSize: 14, marginBottom: 12, outline: 'none', boxSizing: 'border-box' };

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#6C63FF,#764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
            <div style={{ background: 'white', borderRadius: 20, padding: 36, width: '100%', maxWidth: 400, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
                <div style={{ textAlign: 'center', marginBottom: 28 }}>
                    <div style={{ fontSize: 40 }}>🏠</div>
                    <h2 style={{ color: '#6C63FF', fontSize: 24, fontWeight: 700 }}>মেসবাহ</h2>
                    <p style={{ color: '#718096', marginTop: 4 }}>নতুন account বানান</p>
                </div>
                {error && <div style={{ background: '#fff5f5', color: '#e53e3e', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 14 }}>{error}</div>}
                <input style={inputStyle} placeholder="পুরো নাম" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                <input style={inputStyle} placeholder="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                <input style={inputStyle} placeholder="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                <input style={inputStyle} placeholder="University" value={form.university} onChange={e => setForm({ ...form, university: e.target.value })} />
                <input style={inputStyle} placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                <select style={inputStyle} value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
                    <option value="male">ছেলে</option>
                    <option value="female">মেয়ে</option>
                </select>
                <button onClick={handleRegister} disabled={loading}
                    style={{ width: '100%', padding: 14, background: '#6C63FF', color: 'white', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
                    {loading ? 'Loading...' : 'Register'}
                </button>
                <p style={{ textAlign: 'center', marginTop: 16, color: '#718096', fontSize: 14 }}>
                    Account আছে? <Link to="/login" style={{ color: '#6C63FF', fontWeight: 600 }}>Login করুন</Link>
                </p>
            </div>
        </div>
    );
}