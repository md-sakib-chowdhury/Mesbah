import React, { useEffect, useState } from 'react';
import API from '../api';

export default function AdminListings() {
    const [listings, setListings] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState({ title: '', area: '', rent: '', type: 'mess', gender: 'any', description: '', amenities: '', availableFrom: 'এখনই' });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        API.get('/admin/listings').then(r => setListings(r.data));
    }, []);

    const deleteListing = async (id) => {
        if (!window.confirm('Delete?')) return;
        await API.delete(`/admin/listings/${id}`);
        setListings(listings.filter(l => l._id !== id));
    };

    const handleEdit = (listing) => {
        setEditId(listing._id);
        setForm({
            title: listing.title,
            area: listing.area,
            rent: listing.rent,
            type: listing.type,
            gender: listing.gender,
            description: listing.description || '',
            amenities: (listing.amenities || []).join(', '),
            availableFrom: listing.availableFrom || 'এখনই'
        });
        setImagePreview(listing.images?.[0] || '');
        setImageUrl('');
        setShowForm(true);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            setImageUrl('');
        }
    };

    const uploadImage = async () => {
        if (imageFile) {
            setUploading(true);
            const formData = new FormData();
            formData.append('image', imageFile);
            const res = await API.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setUploading(false);
            return res.data.url;
        } else if (imageUrl) {
            setUploading(true);
            const res = await API.post('/upload/url', { url: imageUrl });
            setUploading(false);
            return res.data.url;
        }
        return '';
    };

    const handleSubmit = async () => {
        const uploadedUrl = await uploadImage();
        const data = {
            ...form,
            rent: Number(form.rent),
            amenities: form.amenities.split(',').map(a => a.trim()),
            images: uploadedUrl ? [uploadedUrl] : (editId ? undefined : [])
        };
        if (!uploadedUrl && editId) delete data.images;

        if (editId) {
            const res = await API.put(`/listings/${editId}`, data);
            setListings(listings.map(l => l._id === editId ? res.data : l));
            setEditId(null);
        } else {
            const res = await API.post('/listings', data);
            setListings([res.data, ...listings]);
        }
        setShowForm(false);
        setImageFile(null);
        setImagePreview('');
        setImageUrl('');
        setForm({ title: '', area: '', rent: '', type: 'mess', gender: 'any', description: '', amenities: '', availableFrom: 'এখনই' });
    };

    const inputStyle = { width: '100%', padding: '10px 14px', background: '#0f1117', border: '1px solid #2d3148', borderRadius: 8, color: 'white', fontSize: 14, marginBottom: 12, outline: 'none', boxSizing: 'border-box' };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h1 style={{ fontSize: 24, fontWeight: 700, color: 'white' }}>🏠 Listings</h1>
                <button onClick={() => { setShowForm(!showForm); setEditId(null); setImageFile(null); setImagePreview(''); setImageUrl(''); setForm({ title: '', area: '', rent: '', type: 'mess', gender: 'any', description: '', amenities: '', availableFrom: 'এখনই' }); }}
                    style={{ padding: '10px 20px', background: '#6C63FF', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
                    {showForm ? '✕ Cancel' : '+ Add Listing'}
                </button>
            </div>

            {showForm && (
                <div style={{ background: '#1a1d27', borderRadius: 14, padding: 24, border: '1px solid #2d3148', marginBottom: 24 }}>
                    <h2 style={{ marginBottom: 16, fontSize: 16, color: 'white' }}>{editId ? 'Edit Listing' : 'New Listing'}</h2>
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

                    {/* Image Upload */}
                    <div style={{ marginBottom: 16 }}>
                        <label style={{ color: '#718096', fontSize: 13, display: 'block', marginBottom: 8 }}>Listing Image</label>

                        {/* URL Input */}
                        <input
                            style={{ ...inputStyle, marginBottom: 8 }}
                            placeholder="Unsplash URL paste করো... (https://images.unsplash.com/...)"
                            value={imageUrl}
                            onChange={e => {
                                setImageUrl(e.target.value);
                                setImagePreview(e.target.value);
                                setImageFile(null);
                            }}
                        />

                        <div style={{ color: '#718096', fontSize: 12, marginBottom: 8, textAlign: 'center' }}>— অথবা PC থেকে upload করো —</div>

                        {/* File Input */}
                        <input type="file" accept="image/*" onChange={handleImageChange} style={{ color: 'white', fontSize: 13 }} />

                        {imagePreview && (
                            <img src={imagePreview} alt="preview" style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 8, marginTop: 10 }} />
                        )}
                    </div>

                    <button onClick={handleSubmit} disabled={uploading} style={{ padding: '12px 24px', background: '#6C63FF', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, opacity: uploading ? 0.7 : 1 }}>
                        {uploading ? 'Uploading...' : editId ? 'Update' : 'Save'}
                    </button>
                </div>
            )}

            <div style={{ background: '#1a1d27', borderRadius: 14, border: '1px solid #2d3148', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #2d3148' }}>
                            {['Image', 'Title', 'Area', 'Rent', 'Type', 'Action'].map(h => (
                                <th key={h} style={{ padding: '14px 20px', textAlign: 'left', color: '#718096', fontSize: 13 }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {listings.map(l => (
                            <tr key={l._id} style={{ borderBottom: '1px solid #2d3148' }}>
                                <td style={{ padding: '14px 20px' }}>
                                    {l.images?.[0]
                                        ? <img src={l.images[0]} alt={l.title} style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover' }} />
                                        : <div style={{ width: 48, height: 48, borderRadius: 8, background: '#2d3148', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🏠</div>
                                    }
                                </td>
                                <td style={{ padding: '14px 20px', color: 'white' }}>{l.title}</td>
                                <td style={{ padding: '14px 20px', color: '#718096' }}>{l.area}</td>
                                <td style={{ padding: '14px 20px', color: '#6C63FF', fontWeight: 700 }}>৳{l.rent?.toLocaleString()}</td>
                                <td style={{ padding: '14px 20px', color: '#718096' }}>{l.type}</td>
                                <td style={{ padding: '14px 20px', display: 'flex', gap: 8 }}>
                                    <button onClick={() => handleEdit(l)} style={{ padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', background: '#6C63FF22', color: '#6C63FF', fontWeight: 600 }}>Edit</button>
                                    <button onClick={() => deleteListing(l._id)} style={{ padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', background: '#ff475722', color: '#ff4757', fontWeight: 600 }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                        {listings.length === 0 && <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', color: '#718096' }}>No listings yet</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
}