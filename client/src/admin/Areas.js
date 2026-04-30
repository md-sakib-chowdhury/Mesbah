import React, { useEffect, useState } from 'react';
import API from '../api';

export default function AdminAreas() {
    const [areas, setAreas] = useState([]);
    const [form, setForm] = useState({ name: '', nameBn: '' });
    const [editId, setEditId] = useState(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        API.get('/areas/all').then(r => setAreas(r.data));
    }, []);

    const handleSubmit = async () => {
        if (!form.name || !form.nameBn) return;
        if (editId) {
            const res = await API.put(`/areas/${editId}`, form);
            setAreas(areas.map(a => a._id === editId ? res.data : a));
            setEditId(null);
        } else {
            const res = await API.post('/areas', form);
            setAreas([...areas, res.data]);
        }
        setForm({ name: '', nameBn: '' });
        setShowForm(false);
    };

    const handleEdit = (area) => {
        setEditId(area._id);
        setForm({ name: area.name, nameBn: area.nameBn });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete?')) return;
        await API.delete(`/areas/${id}`);
        setAreas(areas.filter(a => a._id !== id));
    };

    const toggleActive = async (area) => {
        const res = await API.put(`/areas/${area._id}`, { ...area, isActive: !area.isActive });
        setAreas(areas.map(a => a._id === area._id ? res.data : a));
    };

    const inp = {
        width: '100%', padding: '11px 14px', background: '#0f1117',
        border: '1px solid #2d3148', borderRadius: 8, color: 'white',
        fontSize: 14, outline: 'none', boxSizing: 'border-box', marginBottom: 12,
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 24, fontWeight: 700, color: 'white' }}>📍 Areas</h1>
                    <p style={{ color: '#4a5568', fontSize: 13, marginTop: 4 }}>এখান থেকে এলাকা add/edit/delete করো — Frontend এ automatically দেখাবে</p>
                </div>
                <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ name: '', nameBn: '' }); }}
                    style={{ padding: '10px 20px', background: '#6C63FF', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
                    {showForm ? '✕ Cancel' : '+ Add Area'}
                </button>
            </div>

            {showForm && (
                <div style={{ background: '#1a1d27', borderRadius: 14, padding: 24, border: '1px solid #2d3148', marginBottom: 24 }}>
                    <h2 style={{ color: 'white', fontSize: 16, marginBottom: 16 }}>{editId ? 'Edit Area' : 'New Area'}</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div>
                            <label style={{ color: '#718096', fontSize: 12, display: 'block', marginBottom: 6 }}>English Name</label>
                            <input style={inp} placeholder="Mirpur" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                        </div>
                        <div>
                            <label style={{ color: '#718096', fontSize: 12, display: 'block', marginBottom: 6 }}>বাংলা নাম</label>
                            <input style={inp} placeholder="মিরপুর" value={form.nameBn} onChange={e => setForm({ ...form, nameBn: e.target.value })} />
                        </div>
                    </div>
                    <button onClick={handleSubmit}
                        style={{ padding: '11px 24px', background: '#6C63FF', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
                        {editId ? 'Update' : 'Save Area'}
                    </button>
                </div>
            )}

            <div style={{ background: '#1a1d27', borderRadius: 14, border: '1px solid #2d3148', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #2d3148' }}>
                            {['বাংলা নাম', 'English', 'Status', 'Action'].map(h => (
                                <th key={h} style={{ padding: '14px 20px', textAlign: 'left', color: '#718096', fontSize: 13 }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {areas.map(a => (
                            <tr key={a._id} style={{ borderBottom: '1px solid #2d3148' }}>
                                <td style={{ padding: '14px 20px', color: 'white', fontWeight: 600 }}>{a.nameBn}</td>
                                <td style={{ padding: '14px 20px', color: '#718096' }}>{a.name}</td>
                                <td style={{ padding: '14px 20px' }}>
                                    <span onClick={() => toggleActive(a)}
                                        style={{
                                            padding: '4px 12px', borderRadius: 20, fontSize: 12, cursor: 'pointer',
                                            background: a.isActive ? '#48BB7822' : '#ff475722',
                                            color: a.isActive ? '#48BB78' : '#ff4757'
                                        }}>
                                        {a.isActive ? '✓ Active' : '✗ Hidden'}
                                    </span>
                                </td>
                                <td style={{ padding: '14px 20px', display: 'flex', gap: 8 }}>
                                    <button onClick={() => handleEdit(a)}
                                        style={{ padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', background: '#6C63FF22', color: '#6C63FF', fontWeight: 600 }}>Edit</button>
                                    <button onClick={() => handleDelete(a._id)}
                                        style={{ padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', background: '#ff475722', color: '#ff4757', fontWeight: 600 }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                        {areas.length === 0 && (
                            <tr><td colSpan={4} style={{ padding: 40, textAlign: 'center', color: '#718096' }}>
                                কোনো এলাকা নেই — + Add Area click করো
                            </td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}