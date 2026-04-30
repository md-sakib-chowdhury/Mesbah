import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Sora:wght@400;600;700;800&display=swap');

  .profile-wrap { background: #0D0D1A; min-height: 100vh; color: #fff; font-family: 'Sora', sans-serif; }
  .profile-inner { max-width: 800px; margin: 0 auto; padding: 40px 24px 80px; }

  .profile-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 24px; padding: 32px; margin-bottom: 20px; }

  .profile-top { display: flex; align-items: center; gap: 20px; margin-bottom: 24px; }
  .profile-avatar { width: 72px; height: 72px; border-radius: 50%; background: linear-gradient(135deg, #6C63FF, #FF6B6B); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 28px; flex-shrink: 0; }
  .profile-name { font-size: 22px; font-weight: 700; font-family: 'Hind Siliguri', sans-serif; }
  .profile-email { font-size: 13px; color: rgba(255,255,255,0.45); font-family: 'Hind Siliguri', sans-serif; margin-top: 4px; }
  .profile-role { display: inline-block; margin-top: 8px; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; background: rgba(108,99,255,0.15); color: #a78bfa; border: 1px solid rgba(108,99,255,0.25); }

  .section-title { font-size: 14px; font-weight: 700; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; font-family: 'Hind Siliguri', sans-serif; }

  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .form-group { display: flex; flex-direction: column; gap: 6px; }
  .form-group.full { grid-column: 1 / -1; }
  .form-label { font-size: 12px; color: rgba(255,255,255,0.5); font-family: 'Hind Siliguri', sans-serif; font-weight: 600; }
  .form-input { padding: 11px 14px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: #fff; font-size: 14px; font-family: 'Hind Siliguri', sans-serif; outline: none; transition: border-color 0.2s; }
  .form-input:focus { border-color: #a78bfa; }
  .form-select { padding: 11px 14px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: #fff; font-size: 14px; font-family: 'Hind Siliguri', sans-serif; outline: none; cursor: pointer; }
  .form-select option { background: #1a1d27; }

  .prefs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .pref-item { display: flex; flex-direction: column; gap: 6px; }
  .pref-label { font-size: 12px; color: rgba(255,255,255,0.5); font-family: 'Hind Siliguri', sans-serif; }

  .save-btn { width: 100%; padding: 14px; background: linear-gradient(135deg, #6C63FF, #8B83FF); border: none; border-radius: 12px; color: white; font-size: 15px; font-weight: 700; cursor: pointer; font-family: 'Hind Siliguri', sans-serif; transition: opacity 0.2s; margin-top: 20px; }
  .save-btn:hover { opacity: 0.88; }

  .success-msg { background: rgba(72,187,120,0.15); color: #48BB78; border: 1px solid rgba(72,187,120,0.25); border-radius: 10px; padding: 12px 16px; font-size: 14px; font-family: 'Hind Siliguri', sans-serif; margin-bottom: 16px; }

  .post-btn { width: 100%; padding: 14px; background: linear-gradient(135deg, #FF6B6B, #ff8e53); border: none; border-radius: 12px; color: white; font-size: 15px; font-weight: 700; cursor: pointer; font-family: 'Hind Siliguri', sans-serif; transition: opacity 0.2s; }
  .post-btn:hover { opacity: 0.88; }

  .logout-btn { width: 100%; padding: 14px; background: rgba(255,71,87,0.1); border: 1px solid rgba(255,71,87,0.25); border-radius: 12px; color: #ff4757; font-size: 15px; font-weight: 700; cursor: pointer; font-family: 'Hind Siliguri', sans-serif; transition: all 0.2s; }
  .logout-btn:hover { background: rgba(255,71,87,0.2); }

  .login-prompt { text-align: center; padding: 80px 20px; }
  .login-prompt h2 { font-size: 24px; font-weight: 700; font-family: 'Hind Siliguri', sans-serif; margin-bottom: 12px; }
  .login-prompt p { color: rgba(255,255,255,0.45); font-family: 'Hind Siliguri', sans-serif; margin-bottom: 24px; }
  .login-prompt-btn { padding: 14px 32px; background: linear-gradient(135deg, #6C63FF, #8B83FF); border: none; border-radius: 12px; color: white; font-size: 15px; font-weight: 700; cursor: pointer; }

  @media (max-width: 600px) {
    .form-grid { grid-template-columns: 1fr; }
    .prefs-grid { grid-template-columns: 1fr; }
  }
`;

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [form, setForm] = useState({
    name: '', university: '', gender: '', phone: '',
    preferences: { smoking: '', sleepSchedule: '', social: '', diet: '', prayers: '' }
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    API.get('/users/me').then(r => {
      const u = r.data;
      setForm({
        name: u.name || '',
        university: u.university || '',
        gender: u.gender || '',
        phone: u.phone || '',
        preferences: {
          smoking: u.preferences?.smoking || '',
          sleepSchedule: u.preferences?.sleepSchedule || '',
          social: u.preferences?.social || '',
          diet: u.preferences?.diet || '',
          prayers: u.preferences?.prayers || '',
        }
      });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user]);

  const handleSave = async () => {
    try {
      await API.put('/users/me', form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch { }
  };

  const setPref = (key, val) => {
    setForm(prev => ({ ...prev, preferences: { ...prev.preferences, [key]: val } }));
  };

  if (!user) return (
    <>
      <style>{styles}</style>
      <div className="profile-wrap">
        <div className="login-prompt">
          <div style={{ fontSize: 52, marginBottom: 16 }}>👤</div>
          <h2>Login করো</h2>
          <p>প্রোফাইল দেখতে login করতে হবে</p>
          <button className="login-prompt-btn" onClick={() => navigate('/login')}>Login করো</button>
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{styles}</style>
      <div className="profile-wrap">
        <div className="profile-inner">

          {/* Profile Header */}
          <div className="profile-card">
            <div className="profile-top">
              <div className="profile-avatar">{form.name?.[0] || user.name?.[0] || 'U'}</div>
              <div>
                <div className="profile-name">{form.name || user.name}</div>
                <div className="profile-email">{user.email}</div>
                <span className="profile-role">{user.role === 'admin' ? '⚙️ Admin' : '👤 User'}</span>
              </div>
            </div>

            {saved && <div className="success-msg">✅ প্রোফাইল সেভ হয়েছে!</div>}

            {/* Basic Info */}
            <div className="section-title">📝 Basic Info</div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">নাম</label>
                <input className="form-input" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })} placeholder="তোমার নাম" />
              </div>
              <div className="form-group">
                <label className="form-label">University</label>
                <input className="form-input" value={form.university}
                  onChange={e => setForm({ ...form, university: e.target.value })} placeholder="BUET, DU..." />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="01XXXXXXXXX" />
              </div>
              <div className="form-group">
                <label className="form-label">লিঙ্গ</label>
                <select className="form-select" value={form.gender}
                  onChange={e => setForm({ ...form, gender: e.target.value })}>
                  <option value="">বেছে নাও</option>
                  <option value="male">পুরুষ</option>
                  <option value="female">মহিলা</option>
                </select>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="profile-card">
            <div className="section-title">🎯 Preferences (রুমমেট ম্যাচে কাজে আসবে)</div>
            <div className="prefs-grid">
              <div className="pref-item">
                <label className="pref-label">🚬 ধূমপান</label>
                <select className="form-select" value={form.preferences.smoking}
                  onChange={e => setPref('smoking', e.target.value)}>
                  <option value="">বেছে নাও</option>
                  <option value="yes">করি</option>
                  <option value="no">করি না</option>
                </select>
              </div>
              <div className="pref-item">
                <label className="pref-label">🌙 ঘুমের সময়</label>
                <select className="form-select" value={form.preferences.sleepSchedule}
                  onChange={e => setPref('sleepSchedule', e.target.value)}>
                  <option value="">বেছে নাও</option>
                  <option value="early">সকালে উঠি</option>
                  <option value="late">রাতে জাগি</option>
                </select>
              </div>
              <div className="pref-item">
                <label className="pref-label">🤝 স্বভাব</label>
                <select className="form-select" value={form.preferences.social}
                  onChange={e => setPref('social', e.target.value)}>
                  <option value="">বেছে নাও</option>
                  <option value="quiet">শান্ত থাকি</option>
                  <option value="social">সামাজিক</option>
                </select>
              </div>
              <div className="pref-item">
                <label className="pref-label">🍽️ খাবার</label>
                <select className="form-select" value={form.preferences.diet}
                  onChange={e => setPref('diet', e.target.value)}>
                  <option value="">বেছে নাও</option>
                  <option value="veg">ভেজিটেরিয়ান</option>
                  <option value="nonveg">নন-ভেজ</option>
                </select>
              </div>
              <div className="pref-item">
                <label className="pref-label">🕌 নামাজ</label>
                <select className="form-select" value={form.preferences.prayers}
                  onChange={e => setPref('prayers', e.target.value)}>
                  <option value="">বেছে নাও</option>
                  <option value="yes">পড়ি</option>
                  <option value="no">পড়ি না</option>
                </select>
              </div>
            </div>

            <button className="save-btn" onClick={handleSave}>💾 Save Profile</button>
          </div>

          {/* Actions */}
          <div className="profile-card">
            <div className="section-title">⚡ Actions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button className="post-btn" onClick={() => navigate('/listings')}>
                🏠 লিস্টিং দেখো
              </button>
              {user.role === 'admin' && (
                <button className="save-btn" onClick={() => navigate('/admin')}>
                  ⚙️ Admin Panel
                </button>
              )}
              <button className="logout-btn" onClick={() => { logout(); navigate('/'); }}>
                🚪 Logout
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}