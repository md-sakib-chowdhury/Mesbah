import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const { settings } = useSettings();
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropOpen, setDropOpen] = useState(false);
    const dropRef = useRef(null);

    // Outside click এ dropdown বন্ধ হবে
    useEffect(() => {
        const handler = (e) => {
            if (dropRef.current && !dropRef.current.contains(e.target)) {
                setDropOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const navLinks = [
        { path: '/', label: 'হোম' },
        { path: '/listings', label: 'লিস্টিং' },
        { path: '/match', label: 'রুমমেট ম্যাচ' },
        { path: '/chat', label: 'চ্যাট' },
    ];

    const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Sora:wght@400;600;700&display=swap');
    .navbar { position: sticky; top: 0; z-index: 999; background: rgba(13,13,26,0.95); backdrop-filter: blur(16px); border-bottom: 1px solid rgba(255,255,255,0.07); }
    .navbar-inner { max-width: 1200px; margin: 0 auto; padding: 0 24px; height: 64px; display: flex; align-items: center; justify-content: space-between; }
    .nav-logo { display: flex; align-items: center; gap: 10px; cursor: pointer; }
    .nav-logo-icon { width: 36px; height: 36px; border-radius: 10px; background: linear-gradient(135deg, #6C63FF, #FF6B6B); display: flex; align-items: center; justify-content: center; font-size: 18px; overflow: hidden; flex-shrink: 0; }
    .nav-logo-text { font-size: 18px; font-weight: 700; color: #fff; font-family: 'Sora', sans-serif; }
    .nav-links { display: flex; align-items: center; gap: 4px; }
    .nav-link { padding: 8px 14px; border-radius: 8px; font-size: 14px; font-family: 'Hind Siliguri', sans-serif; color: rgba(255,255,255,0.65); cursor: pointer; transition: all 0.2s; border: none; background: none; }
    .nav-link:hover { color: #fff; background: rgba(255,255,255,0.06); }
    .nav-link.active { color: #a78bfa; background: rgba(167,139,250,0.1); font-weight: 600; }
    .nav-actions { display: flex; align-items: center; gap: 8px; }
    .nav-btn { padding: 8px 18px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Hind Siliguri', sans-serif; transition: all 0.2s; }
    .nav-btn-outline { background: transparent; border: 1px solid rgba(255,255,255,0.15); color: rgba(255,255,255,0.8); }
    .nav-btn-outline:hover { border-color: #a78bfa; color: #a78bfa; }
    .nav-btn-primary { background: linear-gradient(135deg, #6C63FF, #8B83FF); border: none; color: white; }
    .nav-btn-primary:hover { opacity: 0.88; }
    .nav-avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #6C63FF, #FF6B6B); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 15px; cursor: pointer; border: 2px solid transparent; transition: border-color 0.2s; }
    .nav-avatar:hover { border-color: #a78bfa; }
    .nav-dropdown { position: relative; }
    .nav-dropdown-menu { position: absolute; right: 0; top: 48px; background: #1a1d27; border: 1px solid #2d3148; border-radius: 12px; padding: 8px; min-width: 180px; box-shadow: 0 8px 32px rgba(0,0,0,0.4); z-index: 999; }
    .nav-dropdown-item { padding: 10px 14px; border-radius: 8px; font-size: 14px; font-family: 'Hind Siliguri', sans-serif; color: #a0aec0; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 8px; }
    .nav-dropdown-item:hover { background: rgba(255,255,255,0.06); color: white; }
    .nav-dropdown-item.danger { color: #ff4757; }
    .nav-dropdown-item.danger:hover { background: rgba(255,71,87,0.1); }
    .nav-divider { height: 1px; background: rgba(255,255,255,0.07); margin: 6px 0; }
    .hamburger { display: none; background: none; border: none; color: white; font-size: 22px; cursor: pointer; padding: 4px; }
    .mobile-menu { background: #1a1d27; border-top: 1px solid #2d3148; padding: 12px; }
    .mobile-nav-link { display: block; padding: 12px 16px; border-radius: 8px; font-size: 15px; font-family: 'Hind Siliguri', sans-serif; color: rgba(255,255,255,0.7); cursor: pointer; margin-bottom: 4px; }
    .mobile-nav-link:hover { background: rgba(255,255,255,0.05); color: white; }
    .mobile-nav-link.active { color: #a78bfa; background: rgba(167,139,250,0.1); }
    @media (max-width: 768px) {
      .nav-links { display: none; }
      .nav-actions { display: none; }
      .hamburger { display: block; }
    }
  `;

    return (
        <>
            <style>{styles}</style>
            <nav className="navbar">
                <div className="navbar-inner">
                    {/* Logo */}
                    <div className="nav-logo" onClick={() => navigate('/')}>
                        <div className="nav-logo-icon">
                            {settings.logo
                                ? <img src={settings.logo} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                : '🏠'}
                        </div>
                        <span className="nav-logo-text">{settings.siteName || 'মেসবাহ'}</span>
                    </div>

                    {/* Desktop Links */}
                    <div className="nav-links">
                        {navLinks.map(link => (
                            <span key={link.path}
                                className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                                onClick={() => navigate(link.path)}>
                                {link.label}
                            </span>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="nav-actions">
                        {user ? (
                            <div className="nav-dropdown" ref={dropRef}>
                                <div className="nav-avatar" onClick={() => setDropOpen(!dropOpen)}>
                                    {user.name?.[0]?.toUpperCase() || 'U'}
                                </div>
                                {dropOpen && (
                                    <div className="nav-dropdown-menu">
                                        <div style={{ padding: '8px 14px 10px', borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: 6 }}>
                                            <div style={{ fontSize: 14, fontWeight: 700, color: 'white', fontFamily: 'Hind Siliguri' }}>{user.name}</div>
                                            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontFamily: 'Hind Siliguri' }}>{user.email}</div>
                                        </div>
                                        <div className="nav-dropdown-item" onClick={() => { navigate('/profile'); setDropOpen(false); }}>
                                            👤 প্রোফাইল
                                        </div>
                                        {user.role === 'admin' && (
                                            <div className="nav-dropdown-item" onClick={() => { navigate('/admin'); setDropOpen(false); }}>
                                                ⚙️ Admin Panel
                                            </div>
                                        )}
                                        <div className="nav-divider" />
                                        <div className="nav-dropdown-item danger" onClick={() => { logout(); navigate('/'); setDropOpen(false); }}>
                                            🚪 Logout
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <button className="nav-btn nav-btn-outline" onClick={() => navigate('/login')}>Login</button>
                                <button className="nav-btn nav-btn-primary" onClick={() => navigate('/register')}>Register</button>
                            </>
                        )}
                    </div>

                    {/* Hamburger */}
                    <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? '✕' : '☰'}
                    </button>
                </div>

                {/* Mobile Menu */}
                {menuOpen && (
                    <div className="mobile-menu">
                        {navLinks.map(link => (
                            <div key={link.path}
                                className={`mobile-nav-link ${location.pathname === link.path ? 'active' : ''}`}
                                onClick={() => { navigate(link.path); setMenuOpen(false); }}>
                                {link.label}
                            </div>
                        ))}
                        <div style={{ borderTop: '1px solid #2d3148', marginTop: 8, paddingTop: 8 }}>
                            {user ? (
                                <>
                                    <div className="mobile-nav-link" onClick={() => { navigate('/profile'); setMenuOpen(false); }}>👤 প্রোফাইল</div>
                                    {user.role === 'admin' && (
                                        <div className="mobile-nav-link" onClick={() => { navigate('/admin'); setMenuOpen(false); }}>⚙️ Admin</div>
                                    )}
                                    <div className="mobile-nav-link" style={{ color: '#ff4757' }}
                                        onClick={() => { logout(); navigate('/'); setMenuOpen(false); }}>
                                        🚪 Logout
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="mobile-nav-link" onClick={() => { navigate('/login'); setMenuOpen(false); }}>🔐 Login</div>
                                    <div className="mobile-nav-link" onClick={() => { navigate('/register'); setMenuOpen(false); }}>✍️ Register</div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </nav>
        </>
    );
}