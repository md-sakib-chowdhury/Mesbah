import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

export default function Footer() {
    const navigate = useNavigate();
    const { settings } = useSettings();

    const styles = `
    .footer { background: #0a0a14; border-top: 1px solid rgba(255,255,255,0.07); padding: 48px 24px 24px; font-family: 'Hind Siliguri', sans-serif; }
    .footer-inner { max-width: 1200px; margin: 0 auto; }
    .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 40px; margin-bottom: 40px; }
    .footer-brand { }
    .footer-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; cursor: pointer; }
    .footer-logo-icon { width: 36px; height: 36px; border-radius: 10px; background: linear-gradient(135deg, #6C63FF, #FF6B6B); display: flex; align-items: center; justify-content: center; font-size: 18px; overflow: hidden; }
    .footer-logo-text { font-size: 18px; font-weight: 700; color: #fff; }
    .footer-desc { font-size: 13px; color: rgba(255,255,255,0.4); line-height: 1.7; max-width: 280px; }
    .footer-contact { margin-top: 16px; display: flex; flex-direction: column; gap: 6px; }
    .footer-contact-item { font-size: 13px; color: rgba(255,255,255,0.5); }
    .footer-contact-item span { color: rgba(255,255,255,0.8); }
    .footer-col-title { font-size: 13px; font-weight: 700; color: rgba(255,255,255,0.9); margin-bottom: 16px; text-transform: uppercase; letter-spacing: 1px; }
    .footer-links { display: flex; flex-direction: column; gap: 10px; }
    .footer-link { font-size: 13px; color: rgba(255,255,255,0.45); cursor: pointer; transition: color 0.2s; }
    .footer-link:hover { color: #a78bfa; }
    .footer-bottom { border-top: 1px solid rgba(255,255,255,0.07); padding-top: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
    .footer-copy { font-size: 12px; color: rgba(255,255,255,0.25); }
    .footer-badges { display: flex; gap: 8px; }
    .footer-badge { font-size: 11px; padding: 4px 10px; border-radius: 20px; background: rgba(108,99,255,0.12); color: rgba(167,139,250,0.7); border: 1px solid rgba(108,99,255,0.2); }
    @media (max-width: 768px) {
      .footer-grid { grid-template-columns: 1fr; gap: 28px; }
      .footer-bottom { flex-direction: column; text-align: center; }
    }
  `;

    return (
        <>
            <style>{styles}</style>
            <footer className="footer">
                <div className="footer-inner">
                    <div className="footer-grid">

                        {/* Brand */}
                        <div className="footer-brand">
                            <div className="footer-logo" onClick={() => navigate('/')}>
                                <div className="footer-logo-icon">
                                    {settings.logo
                                        ? <img src={settings.logo} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        : '🏠'}
                                </div>
                                <span className="footer-logo-text">{settings.siteName || 'মেসবাহ'}</span>
                            </div>
                            <p className="footer-desc">
                                {settings.tagline || 'তোমার পছন্দের মেস খোঁজো'} — বাংলাদেশের সেরা মেস ফাইন্ডিং প্ল্যাটফর্ম।
                            </p>
                            {(settings.contactEmail || settings.contactPhone) && (
                                <div className="footer-contact">
                                    {settings.contactEmail && (
                                        <div className="footer-contact-item">📧 <span>{settings.contactEmail}</span></div>
                                    )}
                                    {settings.contactPhone && (
                                        <div className="footer-contact-item">📞 <span>{settings.contactPhone}</span></div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Quick Links */}
                        <div>
                            <div className="footer-col-title">Quick Links</div>
                            <div className="footer-links">
                                <span className="footer-link" onClick={() => navigate('/')}>🏠 হোম</span>
                                <span className="footer-link" onClick={() => navigate('/listings')}>📋 সব লিস্টিং</span>
                                <span className="footer-link" onClick={() => navigate('/match')}>🤝 রুমমেট ম্যাচ</span>
                                <span className="footer-link" onClick={() => navigate('/chat')}>💬 চ্যাট</span>
                            </div>
                        </div>

                        {/* Account */}
                        <div>
                            <div className="footer-col-title">Account</div>
                            <div className="footer-links">
                                <span className="footer-link" onClick={() => navigate('/login')}>🔐 Login</span>
                                <span className="footer-link" onClick={() => navigate('/register')}>✍️ Register</span>
                                <span className="footer-link" onClick={() => navigate('/profile')}>👤 Profile</span>
                            </div>
                        </div>
                    </div>

                    {/* Bottom */}
                    <div className="footer-bottom">
                        <span className="footer-copy">
                            {settings.footerText || `© ${new Date().getFullYear()} ${settings.siteName || 'মেসবাহ'} — সকল অধিকার সংরক্ষিত`}
                        </span>
                        <div className="footer-badges">
                            <span className="footer-badge">🇧🇩 Made in Bangladesh</span>
                            <span className="footer-badge">⚡ MERN Stack</span>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}