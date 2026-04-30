import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Sora:wght@400;600;700;800&display=swap');

  .listings-wrap { background: #0D0D1A; min-height: 100vh; color: #fff; font-family: 'Sora', sans-serif; }

  .listings-hero { background: linear-gradient(135deg, #1a1040 0%, #0D0D1A 100%); border-bottom: 1px solid rgba(255,255,255,0.06); padding: 48px 48px 36px; }
  .listings-hero-inner { max-width: 1200px; margin: 0 auto; }
  .listings-hero h1 { font-size: 36px; font-weight: 800; font-family: 'Hind Siliguri', sans-serif; margin-bottom: 8px; }
  .listings-hero h1 span { background: linear-gradient(90deg, #a78bfa, #60a5fa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .listings-hero p { color: rgba(255,255,255,0.45); font-family: 'Hind Siliguri', sans-serif; font-size: 15px; margin-bottom: 28px; }

  .search-filter-row { display: flex; gap: 12px; flex-wrap: wrap; }
  .search-inp-wrap { flex: 1; min-width: 200px; position: relative; }
  .search-inp-wrap input { width: 100%; padding: 13px 16px 13px 44px; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12); border-radius: 12px; color: #fff; font-size: 14px; font-family: 'Hind Siliguri', sans-serif; outline: none; box-sizing: border-box; transition: border-color 0.2s; }
  .search-inp-wrap input:focus { border-color: #a78bfa; }
  .search-inp-wrap input::placeholder { color: rgba(255,255,255,0.35); }
  .search-inp-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); font-size: 16px; opacity: 0.5; }
  .filter-select { padding: 13px 16px; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12); border-radius: 12px; color: #fff; font-size: 14px; font-family: 'Hind Siliguri', sans-serif; outline: none; cursor: pointer; }
  .filter-select option { background: #1a1d27; }

  .listings-body { max-width: 1200px; margin: 0 auto; padding: 36px 48px 64px; }

  .type-tabs { display: flex; gap: 8px; margin-bottom: 28px; flex-wrap: wrap; }
  .type-tab { padding: 9px 20px; border-radius: 30px; font-size: 13px; font-family: 'Hind Siliguri', sans-serif; cursor: pointer; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.6); transition: all 0.2s; }
  .type-tab:hover { border-color: rgba(167,139,250,0.4); color: #fff; }
  .type-tab.active { background: linear-gradient(135deg, #6C63FF, #8B83FF); border-color: transparent; color: #fff; font-weight: 600; box-shadow: 0 4px 16px rgba(108,99,255,0.3); }

  .results-info { font-size: 13px; color: rgba(255,255,255,0.4); font-family: 'Hind Siliguri', sans-serif; margin-bottom: 20px; }

  .cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }

  .l-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 20px; overflow: hidden; cursor: pointer; transition: all 0.25s; }
  .l-card:hover { transform: translateY(-4px); border-color: rgba(167,139,250,0.25); box-shadow: 0 12px 40px rgba(108,99,255,0.15); }
  .l-card-img { position: relative; height: 200px; overflow: hidden; }
  .l-card-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
  .l-card:hover .l-card-img img { transform: scale(1.04); }
  .l-card-img-ph { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 52px; background: linear-gradient(135deg, #1a1040, #2d1b69); }
  .l-avail { position: absolute; top: 12px; left: 12px; padding: 5px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; font-family: 'Hind Siliguri', sans-serif; }
  .l-avail.now { background: rgba(16,185,129,0.9); color: #fff; }
  .l-avail.later { background: rgba(245,158,11,0.9); color: #fff; }
  .l-type { position: absolute; top: 12px; right: 12px; padding: 5px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; background: rgba(13,13,26,0.8); color: rgba(255,255,255,0.9); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.1); }
  .l-card-body { padding: 18px 20px; }
  .l-title { font-size: 16px; font-weight: 700; font-family: 'Hind Siliguri', sans-serif; margin-bottom: 6px; }
  .l-loc { font-size: 13px; color: rgba(255,255,255,0.45); font-family: 'Hind Siliguri', sans-serif; margin-bottom: 14px; }
  .l-bottom { display: flex; justify-content: space-between; align-items: flex-end; }
  .l-price-num { font-size: 22px; font-weight: 800; background: linear-gradient(135deg, #a78bfa, #60a5fa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .l-price-unit { font-size: 11px; color: rgba(255,255,255,0.35); font-family: 'Hind Siliguri', sans-serif; }
  .l-tags { display: flex; gap: 6px; flex-wrap: wrap; justify-content: flex-end; }
  .l-tag { font-size: 10px; padding: 3px 9px; border-radius: 20px; background: rgba(108,99,255,0.1); color: rgba(167,139,250,0.85); border: 1px solid rgba(108,99,255,0.18); font-family: 'Hind Siliguri', sans-serif; }

  .empty-box { text-align: center; padding: 80px 20px; color: rgba(255,255,255,0.3); font-family: 'Hind Siliguri', sans-serif; }
  .empty-box div:first-child { font-size: 52px; margin-bottom: 16px; }
  .loading-box { text-align: center; padding: 80px 20px; color: rgba(255,255,255,0.35); font-family: 'Hind Siliguri', sans-serif; }

  @media (max-width: 768px) {
    .listings-hero { padding: 32px 20px 24px; }
    .listings-body { padding: 24px 20px 48px; }
    .cards-grid { grid-template-columns: 1fr; }
    .listings-hero h1 { font-size: 26px; }
  }
`;

const TYPES = [
  { val: 'all', label: 'সব' },
  { val: 'mess', label: '🏠 মেস' },
  { val: 'sublet', label: '🔑 সাবলেট' },
  { val: 'seat', label: '🛏 সিট' },
];

export default function Listings() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('all');
  const [area, setArea] = useState('all');

  useEffect(() => {
    API.get('/listings').then(r => { setListings(r.data); setLoading(false); }).catch(() => setLoading(false));
    API.get('/areas').then(r => setAreas(r.data)).catch(() => { });
  }, []);

  const filtered = listings.filter(l => {
    const matchSearch = search === '' || l.title.toLowerCase().includes(search.toLowerCase()) || l.area.toLowerCase().includes(search.toLowerCase());
    const matchType = type === 'all' || l.type === type;
    const matchArea = area === 'all' || l.area === area;
    return matchSearch && matchType && matchArea;
  });

  const genderLabel = g => g === 'male' ? '👨 ছেলে' : g === 'female' ? '👩 মেয়ে' : '👥 যেকেউ';

  return (
    <>
      <style>{styles}</style>
      <div className="listings-wrap">

        {/* Hero */}
        <div className="listings-hero">
          <div className="listings-hero-inner">
            <h1>সব <span>লিস্টিং</span></h1>
            <p>ঢাকার সেরা মেস, সাবলেট ও সিট খুঁজে নাও</p>
            <div className="search-filter-row">
              <div className="search-inp-wrap">
                <span className="search-inp-icon">🔍</span>
                <input placeholder="মেস বা এলাকার নাম লিখো..." value={search}
                  onChange={e => setSearch(e.target.value)} />
              </div>
              <select className="filter-select" value={area} onChange={e => setArea(e.target.value)}>
                <option value="all">সব এলাকা</option>
                {areas.map(a => <option key={a._id} value={a.nameBn}>{a.nameBn}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="listings-body">
          <div className="type-tabs">
            {TYPES.map(t => (
              <div key={t.val} className={`type-tab ${type === t.val ? 'active' : ''}`}
                onClick={() => setType(t.val)}>
                {t.label}
              </div>
            ))}
          </div>

          {!loading && (
            <div className="results-info">
              {filtered.length === 0 ? 'কোনো লিস্টিং পাওয়া যায়নি' : `${filtered.length}টি লিস্টিং পাওয়া গেছে`}
            </div>
          )}

          {loading ? (
            <div className="loading-box">লোড হচ্ছে...</div>
          ) : filtered.length === 0 ? (
            <div className="empty-box">
              <div>🔍</div>
              কোনো লিস্টিং পাওয়া যায়নি
            </div>
          ) : (
            <div className="cards-grid">
              {filtered.map(l => (
                <div key={l._id} className="l-card" onClick={() => navigate(`/listings/${l._id}`)}>
                  <div className="l-card-img">
                    {l.images?.[0]
                      ? <img src={l.images[0]} alt={l.title} />
                      : <div className="l-card-img-ph">🏢</div>
                    }
                    <span className={`l-avail ${l.availableFrom === 'এখনই' ? 'now' : 'later'}`}>
                      {l.availableFrom === 'এখনই' ? '✓ এখনই খালি' : l.availableFrom}
                    </span>
                    <span className="l-type">
                      {l.type === 'mess' ? '🏠 মেস' : l.type === 'sublet' ? '🔑 সাবলেট' : '🛏 সিট'}
                    </span>
                  </div>
                  <div className="l-card-body">
                    <div className="l-title">{l.title}</div>
                    <div className="l-loc">📍 {l.area}</div>
                    <div className="l-bottom">
                      <div>
                        <div className="l-price-num">৳{l.rent?.toLocaleString()}</div>
                        <div className="l-price-unit">প্রতি মাস</div>
                      </div>
                      <div className="l-tags">
                        <span className="l-tag">{genderLabel(l.gender)}</span>
                        {l.amenities?.slice(0, 2).map(a => (
                          <span key={a} className="l-tag">{a}</span>
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
    </>
  );
}