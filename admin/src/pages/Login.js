import React, { useState } from 'react';
import axios from 'axios';

export default function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true); setError('');
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            if (res.data.user.role !== 'admin') { setError('Admin access only!'); return; }
            onLogin(res.data.token);
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally { setLoading(false); }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#0f1117', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#1a1d27', borderRadius: 16, padding: 40, width: 380, border: '1px solid #2d3148' }}>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <div style={{ fontSize: 40 }}>🏠</div>
                    <h2 style={{ color: '#6C63FF', fontSize: 24, fontWeight: 700 }}>মেসবাহ Admin</h2>
                    <p style={{ color: '#718096', marginTop: 4 }}>Sign in to continue</p>
                </div>
                {error && <div style={{ background: '#ff475722', color: '#ff4757', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 14 }}>{error}</div>}
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email"
                    style={{ width: '100%', padding: '12px 16px', background: '#0f1117', border: '1px solid #2d3148', borderRadius: 8, color: 'white', fontSize: 14, marginBottom: 12, outline: 'none' }} />
                <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password"
                    onKeyDown={e => e.key === 'Enter' && handleLogin()}
                    style={{ width: '100%', padding: '12px 16px', background: '#0f1117', border: '1px solid #2d3148', borderRadius: 8, color: 'white', fontSize: 14, marginBottom: 20, outline: 'none' }} />
                <button onClick={handleLogin} disabled={loading}
                    style={{ width: '100%', padding: 14, background: '#6C63FF', color: 'white', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </div>
        </div>
    );
}