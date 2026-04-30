import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import BottomNav from '../components/BottomNav';
import { useSettings } from '../context/SettingsContext';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Sora:wght@400;600;700&display=swap');

  .home-app { font-family: 'Sora', sans-serif; background: #0D0D1A; min-height: 100vh; color: #fff; overflow-x: hidden; }

  .hero-wrap { position: relative; min-height: 280px; overflow: hidden; }
  .hero-bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0; }
  .hero-bg-color { position: absolute; inset: 0; z-index: 0; }
  .hero-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(13,13,26,0.3) 0%, rgba(13,13,26,0.85) 100%); z-index: 1; }
  .hero-content { position: relative; z-index: 2; padding: 28px 20px 24px; }

  .top-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; }
  .logo { display: flex; align-items: center; gap: 8px; }
  .logo-icon { width: 36px; height: 36px; background: linear-gradient(135deg, #6C63FF, #FF6B6B); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; overflow: hidden; }
  .logo-text { font-size: 20px; font-weight: 700; color: #fff; text-shadow: 0 1px 4px rgba(0,0,0,0.4); }
  .notif-btn { width: 36px; height: 36px; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.2); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 16px; cursor: pointer; backdrop-filter: blur(8px); }

  .hero-headline { margin-bottom: 20px; }
  .hero-headline p { font-family: 'Hind Siliguri', sans-serif; font-size: 13px; color: rgba(255,255,255,0.6); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 6px; }
  .hero-headline h1 { font-size: 28px; font-weight: 700; line-height: 1.25; font-family: 'Hind Siliguri', sans-serif; color: #fff; text-shadow: 0 2px 8px rgba(0,0,0,0.4); }
  .hero-headline h1 span { background: linear-gradient(90deg, #a78bfa, #60a5fa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

  .search-box { position: relative; }
  .search-box input { width: 100%; padding: 14px 16px 14px 44px; background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2); border-radius: 14px; color: #fff; font-size: 14px; font-family: 'Hind Siliguri', sans-serif; outline: none; transition: all 0.2s; box-sizing: border-box; backdrop-filter: blur(10px); }
  .search-box input::placeholder { color: rgba(255,255,255,0.45); }
  .search-box input:focus { border-color: rgba(167,139,250,0.6); background: rgba(255,255,255,0.16); }
  .search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); font-size: 16px; opacity: 0.6; }

  .stats-row { display: flex; gap: 10px; padding: 16px 20px; }
  .stat-card { flex: 1; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 12px; text-align: center; }
  .stat-num { font-size: 20px; font-weight: 700; background: linear-gradient(135deg, #a78bfa, #60a5fa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .stat-label { font-size: 10px; color: rgba(255,255,255,0.45); font-family: 'Hind Siliguri', sans-serif; margin-top: 2px; }

  .section { padding: 0 20px; }
  .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
  .section-title { font-size: 16px; font-weight: 600; font-family: 'Hind Siliguri', sans-serif; }
  .see-all { font-size: 12px; color: #a78bfa; font-family: 'Hind Siliguri', sans-serif; cursor: pointer; }

  .areas-scroll { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; margin-bottom: 24px; scrollbar-width: none; }
  .areas-scroll::-webkit-scrollbar { display: none; }
  .area-pill { flex-shrink: 0; padding: 8px 16px; border-radius: 30px; font-size: 13px; font-family: 'Hind Siliguri', sans-serif; cursor: pointer; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.7); transition: all 0.2s; white-space: nowrap; }
  .area-pill.active { background: linear-gradient(135deg, #6C63FF, #8B83FF); border-color: transparent; color: #fff; font-weight: 600; }

  .listing-grid-home { display: flex; flex-direction: column; gap: 14px; padding: 0 20px 100px; }

  .mes-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 18px; overflow: hidden; transition: transform 0.2s, border-color 0.2s; cursor: pointer; display: flex; flex-direction: row; }
  .mes-card:hover { transform: translateY(-2px); border-color: rgba(167,139,250,0.35); }

  .card-img { width: 110px; min-width: 110px; height: 110px; position: relative; overflow: hidden; flex-shrink: 0; }
  .card-img img { width: 100%; height: 100%; object-fit: cover; }
  .card-img-inner { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 36px; background: linear-gradient(135deg, #1a1040, #2d1b69); }
  .card-badge { position: absolute; bottom: 6px; left: 6px; background: rgba(16,185,129,0.9); color: #fff; font-size: 9px; font-weight: 600; padding: 3px 7px; border-radius: 20px; }
  .card-badge.pending { background: rgba(108,99,255,0.9); }

  .card-body { padding: 12px 14px; flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 6px; overflow: hidden; }
  .card-title { font-size: 14px; font-weight: 600; font-family: 'Hind Siliguri', sans-serif; line-height: 1.3; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .card-price-row { display: flex; align-items: baseline; gap: 4px; }
  .price-num { font-size: 15px; font-weight: 700; background: linear-gradient(135deg, #a78bfa, #60a5fa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .price-unit { font-size: 10px; color: rgba(255,255,255,0.4); font-family: 'Hind Siliguri', sans-serif; }
  .card-meta { display: flex; gap: 8px; font-size: 11px; color: rgba(255,255,255,0.45); font-family: 'Hind Siliguri', sans-serif; flex-wrap: wrap; }
  .card-amenities { display: flex; gap: 5px; flex-wrap: wrap; }
  .amenity-tag { font-size: 9px; padding: 2px 7px; border-radius: 20px; font-family: 'Hind Siliguri', sans-serif; background: rgba(108,99,255,0.12); color: rgba(167,139,250,0.9); border: 1px solid rgba(108,99,255,0.2); }

  .empty-state { text-align: center; padding: 48px 20px; color: rgba(255,255,255,0.35); font-family: 'Hind Siliguri', sans-serif; font-size: 15px; }
  .empty-icon { font-size: 40px; margin-bottom: 12px; }
  .loading-state { text-align: center; padding: 48px 20px; color: rgba(255,255,255,0.4); font-family: 'Hind Siliguri', sans-serif; }
  .footer-text { text-align: center; padding: 16px 20px; color: rgba(255,255,255,0.25); font-size: 12px; font-family: 'Hind Siliguri', sans-serif; }
`;

export default function Home() {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [listings, setListings] = useState([]);
  const [areas, setAreas] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/listings')
      .then(r => { setListings(r.data); setLoading(false); })
      .catch(() => setLoading(false));
    API.get('/areas')
      .then(r => setAreas(r.data))
      .catch(() => { });
  }, []);

  const filtered = listings.filter(l => {
    const matchSearch = search === '' || l.title.includes(search) || l.area.includes(search);
    const matchArea = selectedArea === '' || l.area === selectedArea;
    return matchSearch && matchArea;
  });

  const primaryColor = settings.primaryColor || '#6C63FF';

  return (
    <>
      <style>{styles}</style>
      <div className="home-app">

        {/* HERO */}
        <div className="hero-wrap">
          {settings.heroBanner
            ? <img className="hero-bg" src={settings.heroBanner} alt="banner" />
            : <div className="hero-bg-color" style={{ background: `linear-gradient(135deg, ${primaryColor}cc, #1a1040)` }} />
          }
          <div className="hero-overlay" />
          <div className="hero-content">
            <div className="top-bar">
              <div className="logo">
                <div className="logo-icon">
                  {settings.logo
                    ? <img src={settings.logo} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : '🏠'}
                </div>
                <span className="logo-text">{settings.siteName || 'মেসবাহ'}</span>
              </div>
              <div className="notif-btn">🔔</div>
            </div>

            <div className="hero-headline">
              <p>স্বাগতম 👋</p>
              <h1>তোমার <span>পছন্দের মেস</span><br />{settings.tagline || 'খুঁজে নাও'}</h1>
            </div>

            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="এলাকা বা মেসের নাম লিখো..."
                value={search}
                onChange={e => { setSearch(e.target.value); setSelectedArea(''); }}
              />
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-num">{listings.length}+</div>
            <div className="stat-label">মোট মেস</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">{areas.length}টি</div>
            <div className="stat-label">এলাকা</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">{filtered.length}</div>
            <div className="stat-label">খালি আছে</div>
          </div>
        </div>

        {/* AREA FILTER */}
        <div className="section">
          <div className="section-header">
            <span className="section-title">📍 এলাকা বেছে নাও</span>
          </div>
          <div className="areas-scroll">
            <div
              className={`area-pill ${selectedArea === '' ? 'active' : ''}`}
              onClick={() => { setSelectedArea(''); setSearch(''); }}>
              সব এলাকা
            </div>
            {areas.map(a => (
              <div
                key={a._id}
                className={`area-pill ${selectedArea === a.nameBn ? 'active' : ''}`}
                onClick={() => { setSelectedArea(selectedArea === a.nameBn ? '' : a.nameBn); setSearch(''); }}>
                {a.nameBn}
              </div>
            ))}
          </div>

          <div className="section-header">
            <span className="section-title">
              {loading ? '...' : filtered.length === 0 ? '❌ কোনো লিস্টিং নেই' : `${filtered.length}টি লিস্টিং`}
            </span>
            <span className="see-all" onClick={() => navigate('/listings')}>সব দেখো →</span>
          </div>
        </div>

        {/* LISTINGS */}
        {loading ? (
          <div className="loading-state">লোড হচ্ছে...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            {selectedArea ? `"${selectedArea}" এলাকায় কোনো মেস নেই` : 'কোনো মেস পাওয়া যায়নি'}
          </div>
        ) : (
          <div className="listing-grid-home">
            {filtered.map(l => (
              <div key={l._id} className="mes-card" onClick={() => navigate(`/listings/${l._id}`)}>
                <div className="card-img">
                  {l.images && l.images[0]
                    ? <img src={l.images[0]} alt={l.title} />
                    : <div className="card-img-inner">🏢</div>
                  }
                  <span className={`card-badge ${l.availableFrom !== 'এখনই' ? 'pending' : ''}`}>
                    {l.availableFrom === 'এখনই' ? '✓ খালি' : l.availableFrom}
                  </span>
                </div>
                <div className="card-body">
                  <div className="card-title">{l.title}</div>
                  <div className="card-price-row">
                    <span className="price-num">৳{l.rent?.toLocaleString()}</span>
                    <span className="price-unit">/মাস</span>
                  </div>
                  <div className="card-meta">
                    <span>📍 {l.area}</span>
                    <span>{l.type === 'mess' ? '🏠 মেস' : l.type === 'sublet' ? '🔑 সাবলেট' : '🛏 সিট'}</span>
                    <span>{l.gender === 'male' ? '👨 ছেলে' : l.gender === 'female' ? '👩 মেয়ে' : '👥 যেকেউ'}</span>
                  </div>
                  {l.amenities?.length > 0 && (
                    <div className="card-amenities">
                      {l.amenities.slice(0, 3).map(a => <span key={a} className="amenity-tag">{a}</span>)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {settings.footerText && <div className="footer-text">{settings.footerText}</div>}
        <BottomNav />
      </div>
    </>
  );
}