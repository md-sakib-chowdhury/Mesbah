import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { useSettings } from '../context/SettingsContext';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Sora:wght@400;600;700;800&display=swap');

  .home-wrap { background: #0D0D1A; min-height: 100vh; color: #fff; font-family: 'Sora', sans-serif; }

  /* ===== HERO ===== */
  .hero { position: relative; height: 520px; overflow: hidden; }
  .hero-bg-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center; }
  .hero-bg-grad { position: absolute; inset: 0; }
  .hero-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(13,13,26,0.45) 0%, rgba(13,13,26,0.7) 60%, rgba(13,13,26,1) 100%); }
  .hero-body { position: relative; z-index: 2; height: 100%; display: flex; flex-direction: column; justify-content: flex-end; padding: 0 48px 56px; max-width: 1200px; margin: 0 auto; }
  .hero-tag { display: inline-flex; align-items: center; gap: 6px; background: rgba(167,139,250,0.15); border: 1px solid rgba(167,139,250,0.3); border-radius: 20px; padding: 6px 14px; font-size: 12px; color: #a78bfa; font-weight: 600; margin-bottom: 20px; width: fit-content; letter-spacing: 1px; text-transform: uppercase; }
  .hero-title { font-size: clamp(32px, 5vw, 56px); font-weight: 800; line-height: 1.15; font-family: 'Hind Siliguri', sans-serif; color: #fff; text-shadow: 0 4px 20px rgba(0,0,0,0.5); margin-bottom: 16px; }
  .hero-title span { background: linear-gradient(90deg, #a78bfa, #60a5fa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .hero-sub { font-size: 16px; color: rgba(255,255,255,0.6); font-family: 'Hind Siliguri', sans-serif; margin-bottom: 32px; max-width: 480px; line-height: 1.6; }
  .hero-search-wrap { display: flex; gap: 12px; max-width: 560px; }
  .hero-search { flex: 1; position: relative; }
  .hero-search input { width: 100%; padding: 16px 20px 16px 48px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 14px; color: #fff; font-size: 15px; font-family: 'Hind Siliguri', sans-serif; outline: none; backdrop-filter: blur(12px); transition: all 0.2s; box-sizing: border-box; }
  .hero-search input:focus { border-color: #a78bfa; background: rgba(255,255,255,0.15); }
  .hero-search input::placeholder { color: rgba(255,255,255,0.4); }
  .hero-search-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); font-size: 18px; opacity: 0.5; }
  .hero-search-btn { padding: 16px 28px; background: linear-gradient(135deg, #6C63FF, #8B83FF); border: none; border-radius: 14px; color: white; font-size: 15px; font-weight: 700; cursor: pointer; font-family: 'Hind Siliguri', sans-serif; white-space: nowrap; transition: opacity 0.2s; }
  .hero-search-btn:hover { opacity: 0.88; }

  /* ===== STATS ===== */
  .stats-section { background: #0D0D1A; padding: 0 48px; max-width: 1200px; margin: -28px auto 0; position: relative; z-index: 3; }
  .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .stat-box { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 20px 24px; display: flex; align-items: center; gap: 16px; }
  .stat-icon { font-size: 28px; }
  .stat-num { font-size: 24px; font-weight: 700; background: linear-gradient(135deg, #a78bfa, #60a5fa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; line-height: 1; }
  .stat-label { font-size: 12px; color: rgba(255,255,255,0.45); font-family: 'Hind Siliguri', sans-serif; margin-top: 3px; }

  /* ===== MAIN CONTENT ===== */
  .main-content { max-width: 1200px; margin: 0 auto; padding: 48px 48px 64px; }

  /* ===== AREA PILLS ===== */
  .area-section { margin-bottom: 36px; }
  .section-label { font-size: 13px; color: rgba(255,255,255,0.4); font-family: 'Hind Siliguri', sans-serif; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 14px; }
  .area-pills { display: flex; gap: 10px; flex-wrap: wrap; }
  .area-pill { padding: 9px 20px; border-radius: 30px; font-size: 14px; font-family: 'Hind Siliguri', sans-serif; cursor: pointer; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.65); transition: all 0.2s; }
  .area-pill:hover { border-color: rgba(167,139,250,0.4); color: #fff; }
  .area-pill.active { background: linear-gradient(135deg, #6C63FF, #8B83FF); border-color: transparent; color: #fff; font-weight: 600; box-shadow: 0 4px 16px rgba(108,99,255,0.3); }

  /* ===== LISTINGS ===== */
  .listings-section { }
  .listings-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
  .listings-title { font-size: 20px; font-weight: 700; font-family: 'Hind Siliguri', sans-serif; }
  .listings-count { font-size: 13px; color: rgba(255,255,255,0.4); font-family: 'Hind Siliguri', sans-serif; }
  .see-all-btn { font-size: 13px; color: #a78bfa; font-family: 'Hind Siliguri', sans-serif; cursor: pointer; display: flex; align-items: center; gap: 4px; }
  .see-all-btn:hover { text-decoration: underline; }

  /* ===== CARDS GRID ===== */
  .cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }

  .listing-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 20px; overflow: hidden; cursor: pointer; transition: all 0.25s; }
  .listing-card:hover { transform: translateY(-4px); border-color: rgba(167,139,250,0.25); box-shadow: 0 12px 40px rgba(108,99,255,0.15); }

  .card-img-wrap { position: relative; height: 200px; overflow: hidden; }
  .card-img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
  .listing-card:hover .card-img-wrap img { transform: scale(1.04); }
  .card-img-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 52px; background: linear-gradient(135deg, #1a1040, #2d1b69); }
  .card-avail-badge { position: absolute; top: 12px; left: 12px; padding: 5px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; font-family: 'Hind Siliguri', sans-serif; }
  .card-avail-badge.available { background: rgba(16,185,129,0.9); color: #fff; }
  .card-avail-badge.pending { background: rgba(245,158,11,0.9); color: #fff; }
  .card-type-badge { position: absolute; top: 12px; right: 12px; padding: 5px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; font-family: 'Hind Siliguri', sans-serif; background: rgba(13,13,26,0.75); color: rgba(255,255,255,0.9); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.1); }

  .card-content { padding: 18px 20px; }
  .card-title { font-size: 16px; font-weight: 700; font-family: 'Hind Siliguri', sans-serif; color: #fff; margin-bottom: 8px; line-height: 1.3; }
  .card-location { font-size: 13px; color: rgba(255,255,255,0.45); font-family: 'Hind Siliguri', sans-serif; margin-bottom: 12px; display: flex; align-items: center; gap: 4px; }
  .card-bottom { display: flex; justify-content: space-between; align-items: flex-end; }
  .card-price { }
  .card-price-num { font-size: 22px; font-weight: 800; background: linear-gradient(135deg, #a78bfa, #60a5fa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .card-price-unit { font-size: 11px; color: rgba(255,255,255,0.35); font-family: 'Hind Siliguri', sans-serif; }
  .card-tags { display: flex; gap: 6px; flex-wrap: wrap; justify-content: flex-end; }
  .card-tag { font-size: 10px; padding: 3px 9px; border-radius: 20px; background: rgba(108,99,255,0.1); color: rgba(167,139,250,0.85); border: 1px solid rgba(108,99,255,0.18); font-family: 'Hind Siliguri', sans-serif; }

  /* ===== EMPTY / LOADING ===== */
  .empty-box { text-align: center; padding: 64px 20px; color: rgba(255,255,255,0.3); font-family: 'Hind Siliguri', sans-serif; font-size: 15px; }
  .empty-box div { font-size: 48px; margin-bottom: 16px; }
  .loading-box { text-align: center; padding: 64px 20px; color: rgba(255,255,255,0.35); font-family: 'Hind Siliguri', sans-serif; }

  /* ===== RESPONSIVE ===== */
  @media (max-width: 900px) {
    .hero-body { padding: 0 24px 40px; }
    .stats-section { padding: 0 24px; }
    .main-content { padding: 36px 24px 48px; }
    .hero { height: 420px; }
  }
  @media (max-width: 600px) {
    .hero { height: 380px; }
    .hero-title { font-size: 28px; }
    .hero-search-wrap { flex-direction: column; }
    .stats-grid { grid-template-columns: 1fr; gap: 10px; }
    .cards-grid { grid-template-columns: 1fr; }
    .hero-sub { display: none; }
  }
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
    API.get('/listings').then(r => { setListings(r.data); setLoading(false); }).catch(() => setLoading(false));
    API.get('/areas').then(r => setAreas(r.data)).catch(() => { });
  }, []);

  const filtered = listings.filter(l => {
    const matchSearch = search === '' || l.title.includes(search) || l.area.includes(search);
    const matchArea = selectedArea === '' || l.area === selectedArea;
    return matchSearch && matchArea;
  });

  const primaryColor = settings.primaryColor || '#6C63FF';

  const typeLabel = t => t === 'mess' ? '🏠 মেস' : t === 'sublet' ? '🔑 সাবলেট' : '🛏 সিট';
  const genderLabel = g => g === 'male' ? '👨 ছেলে' : g === 'female' ? '👩 মেয়ে' : '👥 যেকেউ';

  return (
    <>
      <style>{styles}</style>
      <div className="home-wrap">

        {/* ===== HERO ===== */}
        <div className="hero">
          {settings.heroBanner
            ? <img className="hero-bg-img" src={settings.heroBanner} alt="hero" />
            : <div className="hero-bg-grad" style={{ background: `linear-gradient(135deg, ${primaryColor}dd 0%, #1a1040 100%)` }} />
          }
          <div className="hero-overlay" />
          <div className="hero-body">
            <div className="hero-tag">🏠 Bangladesh's #1 Mess Finder</div>
            <h1 className="hero-title">
              তোমার <span>পছন্দের মেস</span><br />
              এখনই খুঁজে নাও
            </h1>
            <p className="hero-sub">
              {settings.tagline || 'ঢাকার সেরা মেস, সাবলেট ও সিট — একটাই প্ল্যাটফর্মে'}
            </p>
            <div className="hero-search-wrap">
              <div className="hero-search">
                <span className="hero-search-icon">🔍</span>
                <input
                  placeholder="এলাকা বা মেসের নাম লিখো..."
                  value={search}
                  onChange={e => { setSearch(e.target.value); setSelectedArea(''); }}
                  onKeyDown={e => e.key === 'Enter' && navigate('/listings')}
                />
              </div>
              <button className="hero-search-btn" onClick={() => navigate('/listings')}>খুঁজুন</button>
            </div>
          </div>
        </div>

        {/* ===== STATS ===== */}
        <div className="stats-section">
          <div className="stats-grid">
            <div className="stat-box">
              <span className="stat-icon">🏘️</span>
              <div>
                <div className="stat-num">{listings.length}+</div>
                <div className="stat-label">মোট লিস্টিং</div>
              </div>
            </div>
            <div className="stat-box">
              <span className="stat-icon">📍</span>
              <div>
                <div className="stat-num">{areas.length}টি</div>
                <div className="stat-label">এলাকা কভার</div>
              </div>
            </div>
            <div className="stat-box">
              <span className="stat-icon">✅</span>
              <div>
                <div className="stat-num">{listings.filter(l => l.availableFrom === 'এখনই').length}</div>
                <div className="stat-label">এখনই খালি</div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== MAIN ===== */}
        <div className="main-content">

          {/* Area Filter */}
          <div className="area-section">
            <div className="section-label">📍 এলাকা বেছে নাও</div>
            <div className="area-pills">
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
          </div>

          {/* Listings */}
          <div className="listings-section">
            <div className="listings-header">
              <div>
                <div className="listings-title">সাম্প্রতিক লিস্টিং</div>
                {!loading && (
                  <div className="listings-count">
                    {filtered.length === 0 ? 'কোনো লিস্টিং নেই' : `${filtered.length}টি পাওয়া গেছে`}
                  </div>
                )}
              </div>
              <span className="see-all-btn" onClick={() => navigate('/listings')}>সব দেখো →</span>
            </div>

            {loading ? (
              <div className="loading-box">লোড হচ্ছে...</div>
            ) : filtered.length === 0 ? (
              <div className="empty-box">
                <div>🔍</div>
                {selectedArea ? `"${selectedArea}" এলাকায় কোনো মেস নেই` : 'কোনো লিস্টিং পাওয়া যায়নি'}
              </div>
            ) : (
              <div className="cards-grid">
                {filtered.map(l => (
                  <div key={l._id} className="listing-card" onClick={() => navigate(`/listings/${l._id}`)}>
                    <div className="card-img-wrap">
                      {l.images?.[0]
                        ? <img src={l.images[0]} alt={l.title} />
                        : <div className="card-img-placeholder">🏢</div>
                      }
                      <span className={`card-avail-badge ${l.availableFrom === 'এখনই' ? 'available' : 'pending'}`}>
                        {l.availableFrom === 'এখনই' ? '✓ এখনই খালি' : l.availableFrom}
                      </span>
                      <span className="card-type-badge">{typeLabel(l.type)}</span>
                    </div>
                    <div className="card-content">
                      <div className="card-title">{l.title}</div>
                      <div className="card-location">📍 {l.area}</div>
                      <div className="card-bottom">
                        <div className="card-price">
                          <div className="card-price-num">৳{l.rent?.toLocaleString()}</div>
                          <div className="card-price-unit">প্রতি মাস</div>
                        </div>
                        <div className="card-tags">
                          <span className="card-tag">{genderLabel(l.gender)}</span>
                          {l.amenities?.slice(0, 2).map(a => (
                            <span key={a} className="card-tag">{a}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}