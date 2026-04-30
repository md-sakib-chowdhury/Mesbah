import React, { useEffect, useState } from 'react';
import API from '../api';

export default function AdminSettings() {
    const [form, setForm] = useState({
        siteName: '', tagline: '', contactEmail: '',
        contactPhone: '', footerText: '', primaryColor: '#6C63FF',
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
        setTimeout(() => setSaved(false), 2000);
    };

    const handleFileUpload = async (e, field) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(field);
        const formData = new FormData();
        formData.append('image', file);
        const res = await API.post('/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        setForm(prev => ({ ...prev, [field]: res.data.url }));
        setUploading('');
    };

    const handleUrlUpload = async (url, field) => {
        if (!url) return;
        setUploading(field);
        const res = await API.post('/upload/url', { url });
        setForm(prev => ({ ...prev, [field]: res.data.url }));
        setUploading('');
    };

    const inputStyle = {
        width: '100%', padding: '11px 14px', background: '#0f1117',
        border: '1px solid #2d3148', borderRadius: 8, color: 'white',
        fontSize: 14, outline: 'none', boxSizing: 'border-box',
    };
    const labelStyle = { color: '#718096', fontSize: 12, marginBottom: 6, display: 'block', fontWeight: 600 };
    const sectionStyle = {
        background: '#1a1d27', borderRadius: 14, padding: 24,
        border: '1px solid #2d3148', marginBottom: 20,
    };

    return (
        <div style={{ maxWidth: 680 }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24, color: 'white' }}>⚙️ Settings</h1>

            {saved && (
                <div style={{ background: '#48BB7822', color: '#48BB78', padding: '12px 16px', borderRadius: 8, marginBottom: 20, fontWeight: 600 }}>
                    ✅ Saved successfully!
                </div>
            )}

            {/* ===== BRANDING ===== */}
            <div style={sectionStyle}>
                <h2 style={{ color: '#a0aec0', fontSize: 13, fontWeight: 700, marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>🎨 Branding</h2>

                <label style={labelStyle}>Site Name</label>
                <input style={{ ...inputStyle, marginBottom: 14 }} value={form.siteName || ''} onChange={e => setForm({ ...form, siteName: e.target.value })} placeholder="মেসবাহ" />

                <label style={labelStyle}>Tagline</label>
                <input style={{ ...inputStyle, marginBottom: 14 }} value={form.tagline || ''} onChange={e => setForm({ ...form, tagline: e.target.value })} placeholder="তোমার পছন্দের মেস খোঁজো" />

                <label style={labelStyle}>Primary Color</label>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 14 }}>
                    <input type="color" value={form.primaryColor || '#6C63FF'} onChange={e => setForm({ ...form, primaryColor: e.target.value })}
                        style={{ width: 48, height: 40, border: 'none', borderRadius: 8, cursor: 'pointer', background: 'none' }} />
                    <span style={{ color: '#718096', fontSize: 13 }}>{form.primaryColor}</span>
                </div>
            </div>

            {/* ===== LOGO ===== */}
            <div style={sectionStyle}>
                <h2 style={{ color: '#a0aec0', fontSize: 13, fontWeight: 700, marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>🖼️ Logo</h2>

                {form.logo && (
                    <div style={{ marginBottom: 12 }}>
                        <img src={form.logo} alt="logo" style={{ height: 60, borderRadius: 8, border: '1px solid #2d3148' }} />
                        <button onClick={() => setForm({ ...form, logo: '' })}
                            style={{ marginLeft: 12, padding: '4px 10px', background: '#ff475722', color: '#ff4757', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
                            Remove
                        </button>
                    </div>
                )}

                <label style={labelStyle}>Upload from PC</label>
                <input type="file" accept="image/*" onChange={e => handleFileUpload(e, 'logo')}
                    style={{ color: 'white', fontSize: 13, marginBottom: 10 }} />

                <label style={{ ...labelStyle, marginTop: 8 }}>Or paste URL</label>
                <div style={{ display: 'flex', gap: 8 }}>
                    <input style={{ ...inputStyle, flex: 1 }} placeholder="https://..." id="logo-url" />
                    <button onClick={() => handleUrlUpload(document.getElementById('logo-url').value, 'logo')}
                        disabled={uploading === 'logo'}
                        style={{ padding: '10px 16px', background: '#6C63FF', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap' }}>
                        {uploading === 'logo' ? '...' : 'Upload'}
                    </button>
                </div>
            </div>

            {/* ===== HERO BANNER ===== */}
            <div style={sectionStyle}>
                <h2 style={{ color: '#a0aec0', fontSize: 13, fontWeight: 700, marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>🏞️ Hero Banner</h2>
                <p style={{ color: '#4a5568', fontSize: 12, marginBottom: 14 }}>এই image Home page এর top এ banner হিসেবে দেখাবে। না দিলে color gradient দেখাবে।</p>

                {form.heroBanner && (
                    <div style={{ marginBottom: 12 }}>
                        <img src={form.heroBanner} alt="banner" style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 10, border: '1px solid #2d3148' }} />
                        <button onClick={() => setForm({ ...form, heroBanner: '' })}
                            style={{ marginTop: 8, padding: '4px 10px', background: '#ff475722', color: '#ff4757', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
                            Remove Banner
                        </button>
                    </div>
                )}

                <label style={labelStyle}>Upload from PC</label>
                <input type="file" accept="image/*" onChange={e => handleFileUpload(e, 'heroBanner')}
                    style={{ color: 'white', fontSize: 13, marginBottom: 10 }} />

                <label style={{ ...labelStyle, marginTop: 8 }}>Or paste Unsplash / any URL</label>
                <div style={{ display: 'flex', gap: 8 }}>
                    <input style={{ ...inputStyle, flex: 1 }} placeholder="https://images.unsplash.com/..." id="banner-url" />
                    <button onClick={() => handleUrlUpload(document.getElementById('banner-url').value, 'heroBanner')}
                        disabled={uploading === 'heroBanner'}
                        style={{ padding: '10px 16px', background: '#6C63FF', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap' }}>
                        {uploading === 'heroBanner' ? '...' : 'Upload'}
                    </button>
                </div>
            </div>

            {/* ===== CONTACT ===== */}
            <div style={sectionStyle}>
                <h2 style={{ color: '#a0aec0', fontSize: 13, fontWeight: 700, marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>📞 Contact & Footer</h2>

                <label style={labelStyle}>Contact Email</label>
                <input style={{ ...inputStyle, marginBottom: 14 }} value={form.contactEmail || ''} onChange={e => setForm({ ...form, contactEmail: e.target.value })} placeholder="admin@mesbah.com" />

                <label style={labelStyle}>Contact Phone</label>
                <input style={{ ...inputStyle, marginBottom: 14 }} value={form.contactPhone || ''} onChange={e => setForm({ ...form, contactPhone: e.target.value })} placeholder="01XXXXXXXXX" />

                <label style={labelStyle}>Footer Text</label>
                <input style={{ ...inputStyle }} value={form.footerText || ''} onChange={e => setForm({ ...form, footerText: e.target.value })} placeholder="© ২০২৬ মেসবাহ" />
            </div>

            <button onClick={handleSave}
                style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #6C63FF, #8B83FF)', color: 'white', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: 16 }}>
                💾 Save All Settings
            </button>
        </div>
    );
}