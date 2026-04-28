import React, { useEffect, useState } from 'react';
import API from '../api';

export default function AdminSettings() {
    const [form, setForm] = useState({ siteName: '', tagline: '', contactEmail: '', contactPhone: '', footerText: '', primaryColor: '#6C63FF' });
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        API.get('/settings').then(r => setForm(r.data));
    }, []);

    const handleSave = async () => {
        await API.put('/settings', form);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const inputStyle = { width: '100%', padding: '12px 16px', background: '#0f1117', border: '1px solid #2d3148', borderRadius: 8, color: 'white', fontSize: 14, marginBottom: 16, outline: 'none', boxSizing: 'border-box' };

    return (
        <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24, color: 'white' }}>⚙️ Settings</h1>
            <div style={{ background: '#1a1d27', borderRadius: 14, padding: 28, border: '1px solid #2d3148', maxWidth: 600 }}>
                {saved && <div style={{ background: '#48BB7822', color: '#48BB78', padding: '10px 16px', borderRadius: 8, marginBottom: 16, fontWeight: 600 }}>✅ Saved!</div>}
                {[['siteName', 'Site Name'], ['tagline', 'Tagline'], ['contactEmail', 'Contact Email'], ['contactPhone', 'Contact Phone'], ['footerText', 'Footer Text']].map(([key, label]) => (
                    <div key={key}>
                        <label style={{ color: '#718096', fontSize: 13, marginBottom: 6, display: 'block' }}>{label}</label>
                        <input style={inputStyle} value={form[key] || ''} onChange={e => setForm({ ...form, [key]: e.target.value })} />
                    </div>
                ))}
                <label style={{ color: '#718096', fontSize: 13, marginBottom: 6, display: 'block' }}>Primary Color</label>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20 }}>
                    <input type="color" value={form.primaryColor || '#6C63FF'} onChange={e => setForm({ ...form, primaryColor: e.target.value })} style={{ width: 50, height: 40, border: 'none', borderRadius: 8, cursor: 'pointer' }} />
                    <span style={{ color: '#718096' }}>{form.primaryColor}</span>
                </div>
                <button onClick={handleSave} style={{ padding: '12px 28px', background: '#6C63FF', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 15 }}>Save Settings</button>
            </div>
        </div>
    );
}