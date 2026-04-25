import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const items = [
    { icon: '🏠', label: 'হোম', route: '/' },
    { icon: '📋', label: 'লিস্টিং', route: '/listings' },
    { icon: '🤝', label: 'ম্যাচ', route: '/match' },
    { icon: '💬', label: 'চ্যাট', route: '/chat' },
    { icon: '👤', label: 'প্রোফাইল', route: '/profile' },
  ];
  return (
    <div className="bottom-nav">
      {items.map(item => (
        <div key={item.route} className={`nav-item ${path === item.route ? 'active' : ''}`} onClick={() => navigate(item.route)}>
          <span className="nav-icon">{item.icon}</span>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
