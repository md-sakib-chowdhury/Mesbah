import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async () => {
        setLoading(true); setError('');
        try {
            const res = await API.post('/auth/login', { email, password });
            login(res.data.user, res.data.token);
            if (res.data.user.role === 'admin') navigate('/admin');
            else navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally { setLoading(false); }
    };

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#6C63FF,#764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
            <div style={{ background: 'white', borderRadius: 20, padding: 36, width: '100%', maxWidth: 400, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
                <div style={{ textAlign: 'center', marginBottom: 28 }}>
                    <div style={{ fontSize: 40 }}>🏠</div>
                    <h2 style={{ color: '#6C63FF', fontSize: 24, fontWeight: 700 }}>মেসবাহ</h2>
                    <p style={{ color: '#718096', marginTop: 4 }}>আপনার account এ login করুন</p>
                </div>
                {error && <div style={{ background: '#fff5f5', color: '#e53e3e', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 14 }}>{error}</div>}
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email"
                    style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #E2E8F0', borderRadius: 10, fontSize: 14, marginBottom: 12, outline: 'none', boxSizing: 'border-box' }} />
                <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password"
                    onKeyDown={e => e.key === 'Enter' && handleLogin()}
                    style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #E2E8F0', borderRadius: 10, fontSize: 14, marginBottom: 20, outline: 'none', boxSizing: 'border-box' }} />
                <button onClick={handleLogin} disabled={loading}
                    style={{ width: '100%', padding: 14, background: '#6C63FF', color: 'white', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
                    {loading ? 'Loading...' : 'Login'}
                </button>
                <p style={{ textAlign: 'center', marginTop: 16, color: '#718096', fontSize: 14 }}>
                    Account নেই? <Link to="/register" style={{ color: '#6C63FF', fontWeight: 600 }}>Register করুন</Link>
                </p>
            </div>
        </div>
    );
}