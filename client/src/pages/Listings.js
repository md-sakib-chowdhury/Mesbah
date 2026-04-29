// import React, { useState, useEffect } from 'react';
// import API from '../api';
// import ListingCard from '../components/ListingCard';
// import BottomNav from '../components/BottomNav';

// export default function Listings() {
//   const [listings, setListings] = useState([]);
//   const [filter, setFilter] = useState('all');
//   const [loading, setLoading] = useState(true);
//   const filters = [['all', 'সব'], ['mess', 'মেস'], ['sublet', 'সাবলেট'], ['seat', 'সিট']];

//   useEffect(() => {
//     const query = filter === 'all' ? '' : `?type=${filter}`;
//     API.get(`/listings${query}`).then(r => { setListings(r.data); setLoading(false); }).catch(() => setLoading(false));
//   }, [filter]);

//   return (
//     <div>
//       <div className="page">
//         <h2 style={{ fontWeight: 700, marginBottom: 12 }}>সব লিস্টিং</h2>
//         <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
//           {filters.map(([val, label]) => (
//             <span key={val} onClick={() => setFilter(val)}
//               style={{ padding: '6px 14px', borderRadius: 20, fontSize: 12, cursor: 'pointer', background: filter === val ? '#6C63FF' : 'white', color: filter === val ? 'white' : '#718096', boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }}>
//               {label}
//             </span>
//           ))}
//         </div>
//         {loading ? (
//           <div style={{ textAlign: 'center', padding: 40, color: '#718096' }}>Loading...</div>
//         ) : listings.length === 0 ? (
//           <div style={{ textAlign: 'center', padding: 40, color: '#718096' }}>কোনো লিস্টিং নেই</div>
//         ) : (
//           <div className="listing-grid">
//             {listings.map(l => <ListingCard key={l._id} listing={l} />)}
//           </div>
//         )}
//       </div>
//       <BottomNav />
//     </div>
//   );
// }
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import BottomNav from '../components/BottomNav';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Sora:wght@400;600;700&display=swap');

  .listings-app { font-family: 'Sora', sans-serif; background: #0D0D1A; min-height: 100vh; color: #fff; }

  .listings-header {
    position: sticky; top: 0; z-index: 50;
    background: rgba(13,13,26,0.92);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(255,255,255,0.06);
    padding: 20px 20px 16px;
  }

  .listings-title-row {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 16px;
  }
  .listings-title {
    font-size: 22px; font-weight: 700;
    font-family: 'Hind Siliguri', sans-serif;
  }
  .listings-title span {
    background: linear-gradient(90deg, #6C63FF, #FF6B6B);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .count-badge {
    font-size: 12px; font-weight: 600;
    background: rgba(108,99,255,0.15);
    color: #a78bfa;
    border: 1px solid rgba(108,99,255,0.25);
    padding: 4px 12px; border-radius: 20px;
    font-family: 'Hind Siliguri', sans-serif;
  }

  .filter-scroll {
    display: flex; gap: 8px;
    overflow-x: auto; scrollbar-width: none;
  }
  .filter-scroll::-webkit-scrollbar { display: none; }

  .filter-pill {
    flex-shrink: 0;
    display: flex; align-items: center; gap: 6px;
    padding: 8px 16px; border-radius: 30px;
    font-size: 13px; font-family: 'Hind Siliguri', sans-serif;
    cursor: pointer; white-space: nowrap;
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.05);
    color: rgba(255,255,255,0.6);
    transition: all 0.2s;
  }
  .filter-pill.active {
    background: linear-gradient(135deg, #6C63FF, #8B83FF);
    border-color: transparent; color: #fff; font-weight: 600;
  }
  .filter-pill .pill-icon { font-size: 14px; }

  .listings-body { padding: 20px 20px 100px; }

  .listing-grid-list { display: flex; flex-direction: column; gap: 14px; }

  .mes-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 18px; overflow: hidden;
    transition: transform 0.2s, border-color 0.2s;
    cursor: pointer;
  }
  .mes-card:hover { transform: translateY(-2px); border-color: rgba(108,99,255,0.35); }

  .card-img {
    width: 100%; height: 155px;
    position: relative; overflow: hidden;
  }
  .card-img-bg {
    width: 100%; height: 100%;
    display: flex; align-items: center; justify-content: center;
    font-size: 44px;
  }
  .bg-mess    { background: linear-gradient(135deg, #1a1040, #2d1b69); }
  .bg-sublet  { background: linear-gradient(135deg, #0d2137, #1a4a7a); }
  .bg-seat    { background: linear-gradient(135deg, #1a2800, #2d5200); }
  .bg-default { background: linear-gradient(135deg, #1a1530, #2a1a40); }

  .type-badge {
    position: absolute; top: 10px; left: 10px;
    font-size: 10px; font-weight: 600;
    padding: 4px 10px; border-radius: 20px;
    font-family: 'Sora', sans-serif;
  }
  .badge-mess   { background: rgba(108,99,255,0.9); color: #fff; }
  .badge-sublet { background: rgba(59,130,246,0.9);  color: #fff; }
  .badge-seat   { background: rgba(16,185,129,0.9);  color: #fff; }

  .card-fav {
    position: absolute; top: 10px; right: 10px;
    width: 30px; height: 30px;
    background: rgba(0,0,0,0.4); border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; cursor: pointer;
    transition: transform 0.15s;
  }
  .card-fav:hover { transform: scale(1.15); }

  .card-body { padding: 14px 16px; }
  .card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
  .card-title { font-size: 15px; font-weight: 600; font-family: 'Hind Siliguri', sans-serif; line-height: 1.3; flex: 1; padding-right: 8px; }
  .card-price { text-align: right; }
  .price-num {
    font-size: 16px; font-weight: 700;
    background: linear-gradient(135deg, #6C63FF, #FF6B6B);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .price-unit { font-size: 10px; color: rgba(255,255,255,0.4); display: block; font-family: 'Hind Siliguri', sans-serif; }

  .card-meta { display: flex; gap: 12px; font-size: 11px; color: rgba(255,255,255,0.45); font-family: 'Hind Siliguri', sans-serif; margin-bottom: 10px; flex-wrap: wrap; }
  .card-tags { display: flex; gap: 6px; flex-wrap: wrap; }
  .tag { font-size: 10px; padding: 3px 9px; border-radius: 20px; font-family: 'Hind Siliguri', sans-serif; background: rgba(108,99,255,0.12); color: rgba(167,139,250,0.9); border: 1px solid rgba(108,99,255,0.2); }

  .empty-state { text-align: center; padding: 60px 20px; color: rgba(255,255,255,0.3); font-family: 'Hind Siliguri', sans-serif; }
  .empty-icon { font-size: 48px; margin-bottom: 14px; }
  .empty-text { font-size: 15px; margin-bottom: 6px; }
  .empty-sub  { font-size: 12px; color: rgba(255,255,255,0.2); }

  .loading-wrap { display: flex; flex-direction: column; gap: 14px; padding: 20px; }
  .skeleton {
    background: rgba(255,255,255,0.04); border-radius: 18px; overflow: hidden;
    border: 1px solid rgba(255,255,255,0.06);
  }
  .skeleton-img { height: 155px; background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; }
  .skeleton-body { padding: 14px 16px; }
  .skeleton-line { height: 12px; border-radius: 6px; background: rgba(255,255,255,0.06); margin-bottom: 10px; }
  .skeleton-line.short { width: 40%; }
  .skeleton-line.med   { width: 65%; }
  @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
`;

const FILTERS = [
  { val: 'all', label: 'সব', icon: '🏘️' },
  { val: 'mess', label: 'মেস', icon: '🏠' },
  { val: 'sublet', label: 'সাবলেট', icon: '🔑' },
  { val: 'seat', label: 'সিট', icon: '🛏️' },
];

const TYPE_CONFIG = {
  mess: { label: 'মেস', badgeClass: 'badge-mess', bgClass: 'bg-mess', icon: '🏠' },
  sublet: { label: 'সাবলেট', badgeClass: 'badge-sublet', bgClass: 'bg-sublet', icon: '🔑' },
  seat: { label: 'সিট', badgeClass: 'badge-seat', bgClass: 'bg-seat', icon: '🛏️' },
};

function SkeletonCard() {
  return (
    <div className="skeleton">
      <div className="skeleton-img" />
      <div className="skeleton-body">
        <div className="skeleton-line med" />
        <div className="skeleton-line short" />
      </div>
    </div>
  );
}

export default function Listings() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const query = filter === 'all' ? '' : `?type=${filter}`;
    API.get(`/listings${query}`)
      .then(r => { setListings(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [filter]);

  const typeConf = (type) => TYPE_CONFIG[type] || { label: type, badgeClass: 'badge-mess', bgClass: 'bg-default', icon: '🏢' };

  return (
    <>
      <style>{styles}</style>
      <div className="listings-app">

        {/* Sticky Header */}
        <div className="listings-header">
          <div className="listings-title-row">
            <h2 className="listings-title">সব <span>লিস্টিং</span></h2>
            {!loading && (
              <span className="count-badge">{listings.length}টি</span>
            )}
          </div>

          <div className="filter-scroll">
            {FILTERS.map(({ val, label, icon }) => (
              <div
                key={val}
                className={`filter-pill ${filter === val ? 'active' : ''}`}
                onClick={() => setFilter(val)}
              >
                <span className="pill-icon">{icon}</span>
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="listings-body">
          {loading ? (
            <div className="loading-wrap">
              {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : listings.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <div className="empty-text">কোনো লিস্টিং পাওয়া যায়নি</div>
              <div className="empty-sub">অন্য ক্যাটাগরি দেখো</div>
            </div>
          ) : (
            <div className="listing-grid-list">
              {listings.map(l => {
                const conf = typeConf(l.type);
                return (
                  <div key={l._id} className="mes-card" onClick={() => navigate(`/listings/${l._id}`)}>
                    <div className="card-img">
                      <div className={`card-img-bg ${conf.bgClass}`}>{conf.icon}</div>
                      <span className={`type-badge ${conf.badgeClass}`}>{conf.label}</span>
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
                        {l.area && <span>📍 {l.area}</span>}
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
                );
              })}
            </div>
          )}
        </div>

        <BottomNav />
      </div>
    </>
  );
}