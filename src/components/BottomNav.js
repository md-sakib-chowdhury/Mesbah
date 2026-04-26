// import React from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// export default function BottomNav() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const path = location.pathname;
//   const items = [
//     { icon: '🏠', label: 'হোম', route: '/' },
//     { icon: '📋', label: 'লিস্টিং', route: '/listings' },
//     { icon: '🤝', label: 'ম্যাচ', route: '/match' },
//     { icon: '💬', label: 'চ্যাট', route: '/chat' },
//     { icon: '👤', label: 'প্রোফাইল', route: '/profile' },
//   ];
//   return (
//     <div className="bottom-nav">
//       {items.map(item => (
//         <div key={item.route} className={`nav-item ${path === item.route ? 'active' : ''}`} onClick={() => navigate(item.route)}>
//           <span className="nav-icon">{item.icon}</span>
//           <span>{item.label}</span>
//         </div>
//       ))}
//     </div>
//   );
// }
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const items = [
    {
      route: '/',
      label: 'হোম',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
          <polyline points="9 21 9 12 15 12 15 21" />
        </svg>
      ),
    },
    {
      route: '/listings',
      label: 'সেভড',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
        </svg>
      ),
    },
    {
      route: '/match',
      label: 'ম্যাচ',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="9" y1="21" x2="9" y2="9" />
        </svg>
      ),
    },
    {
      route: '/chat',
      label: 'চ্যাট',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
      ),
    },
    {
      route: '/profile',
      label: 'প্রোফাইল',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
        </svg>
      ),
    },
  ];

  return (
    <div className="bottom-nav">
      {items.map(item => (
        <div
          key={item.route}
          className={`nav-item ${path === item.route ? 'active' : ''}`}
          onClick={() => navigate(item.route)}
        >
          <span className="nav-icon">{item.icon}</span>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}