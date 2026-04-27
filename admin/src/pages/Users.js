import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Users({ token }) {
    const [users, setUsers] = useState([]);
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        axios.get('http://localhost:5000/api/admin/users', { headers }).then(r => setUsers(r.data));
    }, []);

    const toggleBlock = async (id, isBlocked) => {
        await axios.put(`http://localhost:5000/api/admin/users/${id}/block`, { isBlocked: !isBlocked }, { headers });
        setUsers(users.map(u => u._id === id ? { ...u, isBlocked: !isBlocked } : u));
    };

    return (
        <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>👥 Users</h1>
            <div style={{ background: '#1a1d27', borderRadius: 14, border: '1px solid #2d3148', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #2d3148' }}>
                            {['Name', 'Email', 'University', 'Status', 'Action'].map(h => (
                                <th key={h} style={{ padding: '14px 20px', textAlign: 'left', color: '#718096', fontSize: 13 }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u._id} style={{ borderBottom: '1px solid #2d3148' }}>
                                <td style={{ padding: '14px 20px' }}>{u.name}</td>
                                <td style={{ padding: '14px 20px', color: '#718096' }}>{u.email}</td>
                                <td style={{ padding: '14px 20px', color: '#718096' }}>{u.university || '-'}</td>
                                <td style={{ padding: '14px 20px' }}>
                                    <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 12, background: u.isBlocked ? '#ff475722' : '#48BB7822', color: u.isBlocked ? '#ff4757' : '#48BB78' }}>
                                        {u.isBlocked ? 'Blocked' : 'Active'}
                                    </span>
                                </td>
                                <td style={{ padding: '14px 20px' }}>
                                    <button onClick={() => toggleBlock(u._id, u.isBlocked)}
                                        style={{ padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', background: u.isBlocked ? '#48BB7822' : '#ff475722', color: u.isBlocked ? '#48BB78' : '#ff4757', fontWeight: 600, fontSize: 13 }}>
                                        {u.isBlocked ? 'Unblock' : 'Block'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center', color: '#718096' }}>No users yet</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
}