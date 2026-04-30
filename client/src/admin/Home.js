import React, { useEffect, useState } from 'react';
import API from '../api';

export default function AdminHome() {
    const [form, setForm] = useState({
        siteName: '', tagline: '', primaryColor: '#6C63FF',
        logo: '', heroBanner: '',
    });
    const [saved, setSaved] = useState(false);
    const [uploading, setUploading] = useState('');

    useEffect(() => {
        API.get('/settings').then(r => setForm(r.data));
    }, []);

    const handleSave = async () => {
        await API.put('/settings', form);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    const handleFileUpload = async (e, field) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(field);
        const fd = new FormData();
        fd.append('image', file);
        const res = await API.post('/upload', fd, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        setForm(prev => ({ ...prev, [field]: res.data.url }));
        setUploading('');
    };

    const handleUrlUpload = async (url, field) => {
        if (!url) return;
        setUploading(field);
        try {
            const res = await API.post('/upload/url', { url });
            setForm(prev => ({ ...prev, [field]: res.data.url }));
        } catch { }
        setUploading('');
    };

    const inp = {
        width: '100%', padding: '11px 14px', background: '#0f1117',
        border: '1px solid #2d3148', borderRadius: 8, color: 'white',
        fontSize: 14, outline: 'none', boxSizing: 'border-box',
    };
    const lbl = { color: '#718096', fontSize: 12, marginBottom: 6, display: 'block', fontWeight: 600 };
    const box = { background: '#1a1d27', borderRadius: 14, padding: 24, border: '1px solid #2d3148', marginBottom: 20 };

    return (
        <div style={{ maxWidth: 680 }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 6, color: 'white' }}>🏠 Home Page Control</h1>
            <p style={{ color: '#4a5568', fontSize: 13, marginBottom: 24 }}>এখান থেকে Home page এর সব কিছু control করো</p>

            {saved && (
                <div style={{ background: '#48BB7822', color: '#48BB78', padding: '12px 16px', borderRadius: 8, marginBottom: 20, fontWeight: 600 }}>
                    ✅ Saved! Frontend এ এখনই দেখাবে।
                </div>
            )}

            {/* Site Info */}
            <div style={box}>
                <h2 style={{ color: '#a0aec0', fontSize: 12, fontWeight: 700, marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>📝 Site Info</h2>

                <label style={lbl}>Site Name (Logo এর পাশে দেখাবে)</label>
                <input style={{ ...inp, marginBottom: 14 }} value={form.siteName || ''}
                    onChange={e => setForm({ ...form, siteName: e.target.value })} placeholder="মেসবাহ" />

                <label style={lbl}>Tagline (Hero তে দেখাবে)</label>
                <input style={{ ...inp, marginBottom: 14 }} value={form.tagline || ''}
                    onChange={e => setForm({ ...form, tagline: e.target.value })} placeholder="তোমার পছন্দের মেস খোঁজো" />

                <label style={lbl}>Primary Color</label>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <input type="color" value={form.primaryColor || '#6C63FF'}
                        onChange={e => setForm({ ...form, primaryColor: e.target.value })}
                        style={{ width: 48, height: 40, border: 'none', borderRadius: 8, cursor: 'pointer', background: 'none' }} />
                    <span style={{ color: '#718096', fontSize: 13 }}>{form.primaryColor}</span>
                </div>
            </div>

            {/* Logo */}
            <div style={box}>
                <h2 style={{ color: '#a0aec0', fontSize: 12, fontWeight: 700, marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>🖼️ Logo</h2>

                {form.logo && (
                    <div style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
                        <img src={form.logo} alt="logo" style={{ height: 56, borderRadius: 10, border: '1px solid #2d3148' }} />
                        <button onClick={() => setForm({ ...form, logo: '' })}
                            style={{ padding: '5px 12px', background: '#ff475722', color: '#ff4757', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
                            ✕ Remove
                        </button>
                    </div>
                )}

                <label style={lbl}>PC থেকে upload করো</label>
                <input type="file" accept="image/*" onChange={e => handleFileUpload(e, 'logo')}
                    style={{ color: 'white', fontSize: 13, marginBottom: 12 }} />

                <label style={{ ...lbl, marginTop: 4 }}>অথবা URL দাও</label>
                <div style={{ display: 'flex', gap: 8 }}>
                    <input style={{ ...inp, flex: 1 }} placeholder="https://..." id="logo-url-hp" />
                    <button onClick={() => handleUrlUpload(document.getElementById('logo-url-hp').value, 'logo')}
                        disabled={uploading === 'logo'}
                        style={{ padding: '10px 16px', background: '#6C63FF', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
                        {uploading === 'logo' ? '⏳' : 'Upload'}
                    </button>
                </div>
            </div>

            {/* Hero Banner */}
            <div style={box}>
                <h2 style={{ color: '#a0aec0', fontSize: 12, fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>🏞️ Hero Banner Image</h2>
                <p style={{ color: '#4a5568', fontSize: 12, marginBottom: 16 }}>Home page এর top এ full-width banner। না দিলে color gradient দেখাবে।</p>

                {form.heroBanner && (
                    <div style={{ marginBottom: 14 }}>
                        <img src={form.heroBanner} alt="banner preview"
                            style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 10, border: '1px solid #2d3148' }} />
                        <button onClick={() => setForm({ ...form, heroBanner: '' })}
                            style={{ marginTop: 8, padding: '5px 12px', background: '#ff475722', color: '#ff4757', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
                            ✕ Remove Banner
                        </button>
                    </div>
                )}

                <label style={lbl}>PC থেকে upload করো</label>
                <input type="file" accept="image/*" onChange={e => handleFileUpload(e, 'heroBanner')}
                    style={{ color: 'white', fontSize: 13, marginBottom: 12 }} />

                <label style={{ ...lbl, marginTop: 4 }}>অথবা Unsplash / যেকোনো URL দাও</label>
                <div style={{ display: 'flex', gap: 8 }}>
                    <input style={{ ...inp, flex: 1 }} placeholder="https://images.unsplash.com/..." id="banner-url-hp" />
                    <button onClick={() => handleUrlUpload(document.getElementById('banner-url-hp').value, 'heroBanner')}
                        disabled={uploading === 'heroBanner'}
                        style={{ padding: '10px 16px', background: '#6C63FF', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
                        {uploading === 'heroBanner' ? '⏳' : 'Upload'}
                    </button>
                </div>
            </div>

            {/* Save */}
            <button onClick={handleSave}
                style={{ width: '100%', padding: 14, background: 'linear-gradient(135deg, #6C63FF, #8B83FF)', color: 'white', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: 16 }}>
                💾 Save Changes
            </button>
        </div>
    );
}