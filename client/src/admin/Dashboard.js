import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const StatCard = ({ icon, label, value, color }) => (
    <div style={{ background: '#1a1d27', borderRadius: 14, padding: 24, border: '1px solid #2d3148', flex: 1 }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>{icon}</div>
        <div style={{ fontSize: 28, fontWeight: 700, color }}>{value}</div>
        <div style={{ color: '#718096', fontSize: 14 }}>{label}</div>
    </div>
);

export default function AdminDashboard() {
    const { token } = useAuth();
    const [stats, setStats] = useState({ users: 0, listings: 0, activeListings: 0 });

    useEffect(() => {
        API.get('/admin/stats').then(r => setStats(r.data)).catch(() => { });
    }, []);

    const chartData = [
        { name: 'Users', value: stats.users },
        { name: 'Listings', value: stats.listings },
        { name: 'Active', value: stats.activeListings },
    ];

    return (
        <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24, color: 'white' }}>📊 Dashboard</h1>
            <div style={{ display: 'flex', gap: 16, marginBottom: 32, flexWrap: 'wrap' }}>
                <StatCard icon="👥" label="Total Users" value={stats.users} color="#6C63FF" />
                <StatCard icon="🏠" label="Total Listings" value={stats.listings} color="#48BB78" />
                <StatCard icon="✅" label="Active Listings" value={stats.activeListings} color="#F6AD55" />
            </div>
            <div style={{ background: '#1a1d27', borderRadius: 14, padding: 24, border: '1px solid #2d3148' }}>
                <h2 style={{ marginBottom: 20, fontSize: 16, color: '#a0aec0' }}>Overview</h2>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={chartData}>
                        <XAxis dataKey="name" stroke="#718096" />
                        <YAxis stroke="#718096" />
                        <Tooltip contentStyle={{ background: '#1a1d27', border: '1px solid #2d3148', borderRadius: 8 }} />
                        <Bar dataKey="value" fill="#6C63FF" radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}