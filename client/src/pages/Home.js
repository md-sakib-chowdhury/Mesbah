// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import API from '../api';
// import ListingCard from '../components/ListingCard';
// import BottomNav from '../components/BottomNav';

// export default function Home() {
//   const navigate = useNavigate();
//   const [listings, setListings] = useState([]);
//   const [search, setSearch] = useState('');
//   const [selectedArea, setSelectedArea] = useState('');
//   const [loading, setLoading] = useState(true);
//   const areas = ['মিরপুর', 'ধানমন্ডি', 'উত্তরা', 'মোহাম্মদপুর'];

//   useEffect(() => {
//     API.get('/listings')
//       .then(r => { setListings(r.data); setLoading(false); })
//       .catch(() => setLoading(false));
//   }, []);

//   const filtered = listings.filter(l => {
//     const matchSearch = search === '' || l.title.includes(search) || l.area.includes(search);
//     const matchArea = selectedArea === '' || l.area === selectedArea;
//     return matchSearch && matchArea;
//   });

//   return (
//     <div>
//       <div className="page">
//         <div className="hero">
//           <div className="hero-text">
//             <h2 style={{ fontSize: 26, marginBottom: 6 }}>🏠 মেসবাহ</h2>
//             <p style={{ opacity: 0.85, marginBottom: 12 }}>তোমার পছন্দের মেস খোঁজো</p>
//           </div>
//           <div className="hero-search" style={{ width: '100%' }}>
//             <input className="input" placeholder="এলাকা বা মেসের নাম লিখো..." style={{ background: 'white', color: '#333' }} value={search} onChange={e => { setSearch(e.target.value); setSelectedArea(''); }} />
//           </div>
//         </div>
//         <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
//           {areas.map(a => (
//             <span key={a} onClick={() => { setSelectedArea(selectedArea === a ? '' : a); setSearch(''); }}
//               style={{ background: selectedArea === a ? '#6C63FF' : 'white', color: selectedArea === a ? 'white' : '#333', padding: '6px 14px', borderRadius: 20, fontSize: 13, cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.08)', transition: 'all 0.2s' }}>
//               {a}
//             </span>
//           ))}
//         </div>
//         {loading ? (
//           <div style={{ textAlign: 'center', padding: 40, color: '#718096' }}>Loading...</div>
//         ) : (
//           <>
//             <h3 style={{ marginBottom: 12, fontWeight: 700 }}>
//               {filtered.length === 0 ? '❌ কোনো লিস্টিং পাওয়া যায়নি' : `${filtered.length}টি লিস্টিং`}
//             </h3>
//             <div className="listing-grid">
//               {filtered.map(l => <ListingCard key={l._id} listing={l} />)}
//             </div>
//           </>
//         )}
//       </div>
//       <BottomNav />
//     </div>
//   );
// }
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import ListingCard from '../components/ListingCard';
import BottomNav from '../components/BottomNav';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Sora:wght@400;600;700&display=swap');

  .home-app { font-family: 'Sora', sans-serif; background: #0D0D1A; min-height: 100vh; color: #fff; overflow-x: hidden; }

  .hero-wrap { position: relative; padding: 28px 20px 0; overflow: hidden; }
  .hero-wrap::before { content: ''; position: absolute; top: -60px; left: -40px; width: 280px; height: 280px; background: radial-gradient(circle, rgba(108,99,255,0.35) 0%, transparent 70%); pointer-events: none; }
  .hero-wrap::after { content: ''; position: absolute; top: 20px; right: -60px; width: 200px; height: 200px; background: radial-gradient(circle, rgba(255,107,107,0.2) 0%, transparent 70%); pointer-events: none; }

  .top-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; position: relative; z-index: 1; }
  .logo { display: flex; align-items: center; gap: 8px; }
  .logo-icon { width: 36px; height: 36px; background: linear-gradient(135deg, #6C63FF, #FF6B6B); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
  .logo-text { font-size: 20px; font-weight: 700; background: linear-gradient(90deg, #6C63FF, #FF6B6B); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .notif-btn { width: 36px; height: 36px; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 16px; cursor: pointer; }

  .hero-headline { position: relative; z-index: 1; margin-bottom: 20px; }
  .hero-headline p { font-family: 'Hind Siliguri', sans-serif; font-size: 13px; color: rgba(255,255,255,0.45); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 6px; }
  .hero-headline h1 { font-size: 28px; font-weight: 700; line-height: 1.2; font-family: 'Hind Siliguri', sans-serif; }
  .hero-headline h1 span { background: linear-gradient(90deg, #6C63FF, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

  .search-box { position: relative; z-index: 1; margin-bottom: 20px; }
  .search-box input { width: 100%; padding: 14px 16px 14px 44px; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; color: #fff; font-size: 14px; font-family: 'Hind Siliguri', sans-serif; outline: none; transition: border-color 0.2s; }
  .search-box input::placeholder { color: rgba(255,255,255,0.35); }
  .search-box input:focus { border-color: rgba(108,99,255,0.6); }
  .search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); font-size: 16px; opacity: 0.5; }

  .stats-row { display: flex; gap: 10px; margin-bottom: 24px; position: relative; z-index: 1; }
  .stat-card { flex: 1; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 12px; text-align: center; }
  .stat-num { font-size: 20px; font-weight: 700; background: linear-gradient(135deg, #6C63FF, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .stat-label { font-size: 10px; color: rgba(255,255,255,0.45); font-family: 'Hind Siliguri', sans-serif; margin-top: 2px; }

  .section { padding: 0 20px; }
  .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
  .section-title { font-size: 16px; font-weight: 600; font-family: 'Hind Siliguri', sans-serif; }
  .see-all { font-size: 12px; color: #6C63FF; font-family: 'Hind Siliguri', sans-serif; cursor: pointer; }

  .areas-scroll { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; margin-bottom: 24px; scrollbar-width: none; }
  .areas-scroll::-webkit-scrollbar { display: none; }
  .area-pill { flex-shrink: 0; padding: 8px 16px; border-radius: 30px; font-size: 13px; font-family: 'Hind Siliguri', sans-serif; cursor: pointer; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.7); transition: all 0.2s; white-space: nowrap; }
  .area-pill.active { background: linear-gradient(135deg, #6C63FF, #8B83FF); border-color: transparent; color: #fff; font-weight: 600; }

  .listing-grid { display: flex; flex-direction: column; gap: 14px; padding: 0 20px 100px; }

  .mes-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 18px; overflow: hidden; transition: transform 0.2s, border-color 0.2s; cursor: pointer; }
  .mes-card:hover { transform: translateY(-2px); border-color: rgba(108,99,255,0.3); }
  .card-img { width: 100%; height: 160px; position: relative; overflow: hidden; }
  .card-img-inner { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 48px; background: linear-gradient(135deg, #1a1040, #2d1b69); }
  .card-badge { position: absolute; top: 10px; left: 10px; background: rgba(108,99,255,0.9); color: #fff; font-size: 10px; font-weight: 600; padding: 4px 10px; border-radius: 20px; font-family: 'Sora', sans-serif; }
  .card-badge.available { background: rgba(16,185,129,0.9); }
  .card-fav { position: absolute; top: 10px; right: 10px; width: 30px; height: 30px; background: rgba(0,0,0,0.4); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; cursor: pointer; }

  .card-body { padding: 14px 16px; }
  .card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
  .card-title { font-size: 15px; font-weight: 600; font-family: 'Hind Siliguri', sans-serif; line-height: 1.3; flex: 1; padding-right: 8px; }
  .card-price { text-align: right; }
  .price-num { font-size: 16px; font-weight: 700; background: linear-gradient(135deg, #6C63FF, #FF6B6B); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .price-unit { font-size: 10px; color: rgba(255,255,255,0.4); display: block; font-family: 'Hind Siliguri', sans-serif; }
  .card-meta { display: flex; gap: 12px; font-size: 11px; color: rgba(255,255,255,0.45); font-family: 'Hind Siliguri', sans-serif; margin-bottom: 12px; }
  .card-tags { display: flex; gap: 6px; flex-wrap: wrap; }
  .tag { font-size: 10px; padding: 3px 9px; border-radius: 20px; font-family: 'Hind Siliguri', sans-serif; background: rgba(108,99,255,0.12); color: rgba(108,99,255,0.9); border: 1px solid rgba(108,99,255,0.2); }

  .empty-state { text-align: center; padding: 48px 20px; color: rgba(255,255,255,0.35); font-family: 'Hind Siliguri', sans-serif; font-size: 15px; }
  .empty-icon { font-size: 40px; margin-bottom: 12px; }

  .loading-state { text-align: center; padding: 48px 20px; color: rgba(255,255,255,0.4); font-family: 'Hind Siliguri', sans-serif; }
`;

const AREAS = ['মিরপুর', 'ধানমন্ডি', 'উত্তরা', 'মোহাম্মদপুর'];

export default function Home() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/listings')
      .then(r => { setListings(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = listings.filter(l => {
    const matchSearch = search === '' || l.title.includes(search) || l.area.includes(search);
    const matchArea = selectedArea === '' || l.area === selectedArea;
    return matchSearch && matchArea;
  });

  return (
    <>
      <style>{styles}</style>
      <div className="home-app">

        {/* Hero */}
        <div className="hero-wrap">
          <div className="top-bar">
            <div className="logo">
              <div className="logo-icon">🏠</div>
              <span className="logo-text">মেসবাহ</span>
            </div>
            <div className="notif-btn">🔔</div>
          </div>

          <div className="hero-headline">
            <p>স্বাগতম 👋</p>
            <h1>তোমার <span>পছন্দের মেস</span><br />খুঁজে নাও</h1>
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

          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-num">{listings.length}+</div>
              <div className="stat-label">মোট মেস</div>
            </div>
            <div className="stat-card">
              <div className="stat-num">{AREAS.length}টি</div>
              <div className="stat-label">এলাকা</div>
            </div>
            <div className="stat-card">
              <div className="stat-num">{filtered.length}</div>
              <div className="stat-label">খালি আছে</div>
            </div>
          </div>
        </div>

        {/* Area Filter */}
        <div className="section">
          <div className="section-header">
            <span className="section-title">📍 এলাকা বেছে নাও</span>
          </div>
          <div className="areas-scroll">
            <div
              className={`area-pill ${selectedArea === '' ? 'active' : ''}`}
              onClick={() => { setSelectedArea(''); setSearch(''); }}
            >
              সব এলাকা
            </div>
            {AREAS.map(a => (
              <div
                key={a}
                className={`area-pill ${selectedArea === a ? 'active' : ''}`}
                onClick={() => { setSelectedArea(selectedArea === a ? '' : a); setSearch(''); }}
              >
                {a}
              </div>
            ))}
          </div>

          <div className="section-header">
            <span className="section-title">
              {loading ? '...' : filtered.length === 0 ? '❌ কোনো লিস্টিং নেই' : `${filtered.length}টি লিস্টিং`}
            </span>
            <span className="see-all">সব দেখো →</span>
          </div>
        </div>

        {/* Listings */}
        {loading ? (
          <div className="loading-state">লোড হচ্ছে...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            এই এলাকায় কোনো মেস পাওয়া যায়নি
          </div>
        ) : (
          <div className="listing-grid">
            {filtered.map(l => (
              <div key={l._id} className="mes-card" onClick={() => navigate(`/listing/${l._id}`)}>
                <div className="card-img">
                  <div className="card-img-inner">🏢</div>
                  {l.available && <span className="card-badge available">সিট খালি</span>}
                  <span className="card-fav">🤍</span>
                </div>
                <div className="card-body">
                  <div className="card-top">
                    <div className="card-title">{l.title}</div>
                    <div className="card-price">
                      <span className="price-num">৳{l.price}</span>
                      <span className="price-unit">টাকা/মাস</span>
                    </div>
                  </div>
                  <div className="card-meta">
                    <span>📍 {l.area}</span>
                    {l.rating && <span>⭐ {l.rating}</span>}
                    {l.beds && <span>🛏 {l.beds}</span>}
                  </div>
                  {l.tags?.length > 0 && (
                    <div className="card-tags">
                      {l.tags.map(t => <span key={t} className="tag">{t}</span>)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <BottomNav />
      </div>
    </>
  );
}