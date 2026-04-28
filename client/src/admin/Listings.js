import React, { useEffect, useState } from 'react';
import API from '../api';

export default function AdminListings() {
    const [listings, setListings] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ title: '', area: '', rent: '', type: 'mess', gender: 'any', description: '', amenities: '', availableFrom: 'এখনই' });

    useEffect(() => {
        API.get('/admin/listings').then(r => setListings(r.data));
    }, []);

    const deleteListing = async (id) => {
        if (!window.confirm('Delete?')) return;
        await API.delete(`/admin/listings/${id}`);
        setListings(listings.filter(l => l._id !== id));
    };

    const handleSubmit = async () => {
        const data = { ...form, rent: Number(form.rent), amenities: form.amenities.split(',').map(a => a.trim()) };
        const res = await API.post('/listings', data);
        setListings([res.data, ...listings]);
        setShowForm(false);
        setForm({ title: '', area: '', rent: '', type: 'mess', gender: 'any', description: '', amenities: '', availableFrom: 'এখনই' });
    };

    const inputStyle = { width: '100%', padding: '10px 14px', background: '#0f1117', border: '1px solid #2d3148', borderRadius: 8, color: 'white', fontSize: 14, marginBottom: 12, outline: 'none', boxSizing: 'border-box' };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h1 style={{ fontSize: 24, fontWeight: 700, color: 'white' }}>🏠 Listings</h1>
                <button onClick={() => setShowForm(!showForm)} style={{ padding: '10px 20px', background: '#6C63FF', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
                    {showForm ? '✕ Cancel' : '+ Add Listing'}
                </button>
            </div>
            {showForm && (
                <div style={{ background: '#1a1d27', borderRadius: 14, padding: 24, border: '1px solid #2d3148', marginBottom: 24 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <input style={inputStyle} placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                        <input style={inputStyle} placeholder="Area" value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} />
                        <input style={inputStyle} placeholder="Rent" type="number" value={form.rent} onChange={e => setForm({ ...form, rent: e.target.value })} />
                        <input style={inputStyle} placeholder="Available From" value={form.availableFrom} onChange={e => setForm({ ...form, availableFrom: e.target.value })} />
                        <select style={inputStyle} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                            <option value="mess">মেস</option>
                            <option value="sublet">সাবলেট</option>
                            <option value="seat">সিট</option>
                        </select>
                        <select style={inputStyle} value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
                            <option value="any">যেকেউ</option>
                            <option value="male">ছেলে</option>
                            <option value="female">মেয়ে</option>
                        </select>
                    </div>
                    <input style={inputStyle} placeholder="Amenities (WiFi, গ্যাস, পানি)" value={form.amenities} onChange={e => setForm({ ...form, amenities: e.target.value })} />
                    <textarea style={{ ...inputStyle, height: 80, resize: 'none' }} placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                    <button onClick={handleSubmit} style={{ padding: '12px 24px', background: '#6C63FF', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>Save</button>
                </div>
            )}
            <div style={{ background: '#1a1d27', borderRadius: 14, border: '1px solid #2d3148', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #2d3148' }}>
                            {['Title', 'Area', 'Rent', 'Type', 'Action'].map(h => (
                                <th key={h} style={{ padding: '14px 20px', textAlign: 'left', color: '#718096', fontSize: 13 }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {listings.map(l => (
                            <tr key={l._id} style={{ borderBottom: '1px solid #2d3148' }}>
                                <td style={{ padding: '14px 20px', color: 'white' }}>{l.title}</td>
                                <td style={{ padding: '14px 20px', color: '#718096' }}>{l.area}</td>
                                <td style={{ padding: '14px 20px', color: '#6C63FF', fontWeight: 700 }}>৳{l.rent?.toLocaleString()}</td>
                                <td style={{ padding: '14px 20px', color: '#718096' }}>{l.type}</td>
                                <td style={{ padding: '14px 20px' }}>
                                    <button onClick={() => deleteListing(l._id)} style={{ padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', background: '#ff475722', color: '#ff4757', fontWeight: 600 }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                        {listings.length === 0 && <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center', color: '#718096' }}>No listings yet</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
}