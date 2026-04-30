import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Sora:wght@400;600;700;800&display=swap');

  .match-wrap { background: #0D0D1A; min-height: 100vh; color: #fff; font-family: 'Sora', sans-serif; }
  .match-hero { background: linear-gradient(135deg, #1a1040, #0D0D1A); border-bottom: 1px solid rgba(255,255,255,0.06); padding: 48px 48px 36px; }
  .match-hero-inner { max-width: 1200px; margin: 0 auto; }
  .match-hero h1 { font-size: 36px; font-weight: 800; font-family: 'Hind Siliguri', sans-serif; margin-bottom: 8px; }
  .match-hero h1 span { background: linear-gradient(90deg, #f472b6, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .match-hero p { color: rgba(255,255,255,0.45); font-family: 'Hind Siliguri', sans-serif; font-size: 15px; }

  .match-body { max-width: 1200px; margin: 0 auto; padding: 36px 48px 64px; }

  .match-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }

  .match-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 20px; padding: 24px; transition: all 0.25s; }
  .match-card:hover { border-color: rgba(167,139,250,0.25); box-shadow: 0 8px 32px rgba(108,99,255,0.12); transform: translateY(-2px); }

  .match-card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
  .match-avatar { width: 52px; height: 52px; border-radius: 50%; background: linear-gradient(135deg, #6C63FF, #FF6B6B); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 20px; }
  .match-score-wrap { text-align: center; }
  .match-score { font-size: 28px; font-weight: 800; line-height: 1; }
  .match-score.high { background: linear-gradient(135deg, #10b981, #34d399); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .match-score.mid { background: linear-gradient(135deg, #f59e0b, #fbbf24); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .match-score.low { background: linear-gradient(135deg, #ef4444, #f87171); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .match-score-label { font-size: 10px; color: rgba(255,255,255,0.4); font-family: 'Hind Siliguri', sans-serif; }

  .match-name { font-size: 17px; font-weight: 700; font-family: 'Hind Siliguri', sans-serif; margin-bottom: 4px; }
  .match-uni { font-size: 13px; color: rgba(255,255,255,0.45); font-family: 'Hind Siliguri', sans-serif; margin-bottom: 14px; }

  .match-score-bar-wrap { background: rgba(255,255,255,0.06); border-radius: 20px; height: 6px; margin-bottom: 16px; overflow: hidden; }
  .match-score-bar { height: 100%; border-radius: 20px; transition: width 0.6s; }

  .match-prefs { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 16px; }
  .match-pref { font-size: 11px; padding: 4px 10px; border-radius: 20px; background: rgba(108,99,255,0.1); color: rgba(167,139,250,0.85); border: 1px solid rgba(108,99,255,0.18); font-family: 'Hind Siliguri', sans-serif; }

  .match-btn { width: 100%; padding: 11px; background: linear-gradient(135deg, #6C63FF, #8B83FF); border: none; border-radius: 10px; color: white; font-size: 14px; font-weight: 700; cursor: pointer; font-family: 'Hind Siliguri', sans-serif; transition: opacity 0.2s; }
  .match-btn:hover { opacity: 0.88; }

  .login-prompt { text-align: center; padding: 80px 20px; }
  .login-prompt h2 { font-size: 24px; font-weight: 700; font-family: 'Hind Siliguri', sans-serif; margin-bottom: 12px; }
  .login-prompt p { color: rgba(255,255,255,0.45); font-family: 'Hind Siliguri', sans-serif; margin-bottom: 24px; }
  .login-prompt-btn { padding: 14px 32px; background: linear-gradient(135deg, #6C63FF, #8B83FF); border: none; border-radius: 12px; color: white; font-size: 15px; font-weight: 700; cursor: pointer; font-family: 'Hind Siliguri', sans-serif; }

  .empty-box { text-align: center; padding: 80px 20px; color: rgba(255,255,255,0.3); font-family: 'Hind Siliguri', sans-serif; }
  .loading-box { text-align: center; padding: 80px 20px; color: rgba(255,255,255,0.35); font-family: 'Hind Siliguri', sans-serif; }

  @media (max-width: 768px) {
    .match-hero { padding: 32px 20px 24px; }
    .match-body { padding: 24px 20px 48px; }
    .match-hero h1 { font-size: 26px; }
  }
`;

export default function RoommateMatch() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    API.get('/users/match')
      .then(r => { setUsers(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [user]);

  const scoreClass = s => s >= 70 ? 'high' : s >= 40 ? 'mid' : 'low';
  const scoreColor = s => s >= 70 ? '#10b981' : s >= 40 ? '#f59e0b' : '#ef4444';

  return (
    <>
      <style>{styles}</style>
      <div className="match-wrap">
        <div className="match-hero">
          <div className="match-hero-inner">
            <h1>রুমমেট <span>ম্যাচ</span> 🤝</h1>
            <p>তোমার পছন্দ অনুযায়ী সেরা রুমমেট খুঁজে নাও</p>
          </div>
        </div>

        <div className="match-body">
          {!user ? (
            <div className="login-prompt">
              <div style={{ fontSize: 52, marginBottom: 16 }}>🔐</div>
              <h2>Login করো</h2>
              <p>রুমমেট ম্যাচ দেখতে login করতে হবে</p>
              <button className="login-prompt-btn" onClick={() => navigate('/login')}>Login করো</button>
            </div>
          ) : loading ? (
            <div className="loading-box">ম্যাচ খোঁজা হচ্ছে...</div>
          ) : users.length === 0 ? (
            <div className="empty-box">
              <div style={{ fontSize: 52, marginBottom: 16 }}>😔</div>
              কোনো ম্যাচ পাওয়া যায়নি
            </div>
          ) : (
            <div className="match-grid">
              {users.map(u => (
                <div key={u._id} className="match-card">
                  <div className="match-card-top">
                    <div className="match-avatar">{u.name?.[0] || 'U'}</div>
                    <div className="match-score-wrap">
                      <div className={`match-score ${scoreClass(u.matchScore)}`}>{u.matchScore}%</div>
                      <div className="match-score-label">ম্যাচ স্কোর</div>
                    </div>
                  </div>
                  <div className="match-name">{u.name}</div>
                  <div className="match-uni">🎓 {u.university || 'University'}</div>
                  <div className="match-score-bar-wrap">
                    <div className="match-score-bar"
                      style={{ width: `${u.matchScore}%`, background: `linear-gradient(90deg, ${scoreColor(u.matchScore)}, ${scoreColor(u.matchScore)}aa)` }} />
                  </div>
                  <div className="match-prefs">
                    <span className="match-pref">{u.preferences?.smoking ? '🚬 ধূমপায়ী' : '🚭 অধূমপায়ী'}</span>
                    <span className="match-pref">{u.preferences?.sleepSchedule === 'early' ? '🌅 সকাল' : '🌙 রাত'}</span>
                    <span className="match-pref">{u.preferences?.social === 'quiet' ? '🤫 শান্ত' : '🎉 সামাজিক'}</span>
                    {u.preferences?.prayers && <span className="match-pref">🕌 নামাজী</span>}
                  </div>
                  <button className="match-btn" onClick={() => {
                    if (!user) { navigate('/login'); return; }
                    navigate(`/chat?to=${u._id}&name=${encodeURIComponent(u.name)}`);
                  }}>💬 মেসেজ করো</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}