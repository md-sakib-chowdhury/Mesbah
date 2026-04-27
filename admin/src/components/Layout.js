import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const menuItems = [
    { path: '/', icon: '📊', label: 'Dashboard' },
    { path: '/listings', icon: '🏠', label: 'Listings' },
    { path: '/users', icon: '👥', label: 'Users' },
    { path: '/settings', icon: '⚙️', label: 'Settings' },
];

export default function Layout({ children, onLogout }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#0f1117' }}>
            {/* Sidebar */}
            <div style={{ width: collapsed ? 70 : 240, background: '#1a1d27', borderRight: '1px solid #2d3148', transition: 'width 0.3s', display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh', zIndex: 100 }}>
                <div style={{ padding: '20px 16px', borderBottom: '1px solid #2d3148', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {!collapsed && <div><div style={{ fontSize: 18, fontWeight: 700, color: '#6C63FF' }}>🏠 মেসবাহ</div><div style={{ fontSize: 11, color: '#718096' }}>Admin Panel</div></div>}
                    <button onClick={() => setCollapsed(!collapsed)} style={{ background: 'none', border: 'none', color: '#718096', cursor: 'pointer', fontSize: 18 }}>{collapsed ? '→' : '←'}</button>
                </div>
                <nav style={{ flex: 1, padding: '16px 8px' }}>
                    {menuItems.map(item => (
                        <div key={item.path} onClick={() => navigate(item.path)}
                            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 10, cursor: 'pointer', marginBottom: 4, background: location.pathname === item.path ? '#6C63FF22' : 'transparent', color: location.pathname === item.path ? '#6C63FF' : '#a0aec0', transition: 'all 0.2s' }}>
                            <span style={{ fontSize: 20 }}>{item.icon}</span>
                            {!collapsed && <span style={{ fontWeight: 600 }}>{item.label}</span>}
                        </div>
                    ))}
                </nav>
                <div style={{ padding: 16, borderTop: '1px solid #2d3148' }}>
                    <button onClick={onLogout} style={{ width: '100%', padding: '10px', background: '#ff4757', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
                        {collapsed ? '🚪' : '🚪 Logout'}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ marginLeft: collapsed ? 70 : 240, flex: 1, transition: 'margin 0.3s', minHeight: '100vh' }}>
                <div style={{ padding: 24 }}>{children}</div>
            </div>
        </div>
    );
}