// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import API from '../api';
// import BottomNav from '../components/BottomNav';

// export default function ListingDetail() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [listing, setListing] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     API.get(`/listings/${id}`).then(r => { setListing(r.data); setLoading(false); }).catch(() => setLoading(false));
//   }, [id]);

//   if (loading) return <div className="page" style={{ textAlign: 'center', padding: 40 }}>Loading...</div>;
//   if (!listing) return <div className="page">পাওয়া যায়নি</div>;

//   return (
//     <div>
//       <div className="page">
//         <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', marginBottom: 12 }}>← ফিরে যাও</button>
//         <div style={{ background: 'linear-gradient(135deg,#6C63FF,#764ba2)', borderRadius: 16, height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 60, marginBottom: 16 }}>🏠</div>
//         <h2 style={{ fontWeight: 700, marginBottom: 8 }}>{listing.title}</h2>
//         <p style={{ color: '#718096', marginBottom: 12 }}>📍 {listing.area}</p>
//         <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
//           <span className={`badge badge-${listing.type}`}>{listing.type}</span>
//           <span className={`badge badge-${listing.gender}`}>{listing.gender}</span>
//         </div>
//         <div className="card">
//           <h3 style={{ marginBottom: 8 }}>বিবরণ</h3>
//           <p style={{ color: '#718096' }}>{listing.description}</p>
//         </div>
//         <div className="card">
//           <h3 style={{ marginBottom: 8 }}>সুবিধা</h3>
//           <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
//             {listing.amenities?.map(a => <span key={a} className="tag">{a}</span>)}
//           </div>
//         </div>
//         {listing.owner && (
//           <div className="card">
//             <h3 style={{ marginBottom: 8 }}>যোগাযোগ</h3>
//             <p style={{ color: '#718096' }}>👤 {listing.owner.name}</p>
//             <p style={{ color: '#718096' }}>📞 {listing.owner.phone}</p>
//           </div>
//         )}
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', borderRadius: 14, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
//           <div>
//             <div style={{ fontWeight: 700, fontSize: 22, color: '#6C63FF' }}>৳{listing.rent?.toLocaleString()}</div>
//             <div style={{ fontSize: 12, color: '#718096' }}>প্রতি মাস</div>
//           </div>
//           <button className="btn btn-primary" onClick={() => navigate('/chat')}>💬 মেসেজ করো</button>
//         </div>
//       </div>
//       <BottomNav />
//     </div>
//   );
// }
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';
import BottomNav from '../components/BottomNav';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Sora:wght@400;600;700&display=swap');

  .detail-app { font-family: 'Sora', sans-serif; background: #0D0D1A; min-height: 100vh; color: #fff; }

  .detail-hero {
    width: 100%; height: 240px;
    position: relative; overflow: hidden;
  }
  .hero-bg {
    width: 100%; height: 100%;
    display: flex; align-items: center; justify-content: center;
    font-size: 72px;
    background: linear-gradient(135deg, #1a1040, #2d1b69);
  }
  .hero-bg.sublet { background: linear-gradient(135deg, #0d2137, #1a4a7a); }
  .hero-bg.seat   { background: linear-gradient(135deg, #1a2800, #2d5200); }

  .hero-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to bottom, rgba(13,13,26,0.2) 0%, rgba(13,13,26,0.85) 100%);
  }
  .back-btn {
    position: absolute; top: 16px; left: 16px;
    width: 38px; height: 38px;
    background: rgba(0,0,0,0.45);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; cursor: pointer; z-index: 2;
    color: #fff;
    transition: background 0.2s;
  }
  .back-btn:hover { background: rgba(108,99,255,0.5); }

  .fav-btn {
    position: absolute; top: 16px; right: 16px;
    width: 38px; height: 38px;
    background: rgba(0,0,0,0.45);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; cursor: pointer; z-index: 2;
    transition: background 0.2s;
  }
  .fav-btn:hover { background: rgba(255,107,107,0.4); }

  .hero-bottom {
    position: absolute; bottom: 16px; left: 16px; right: 16px;
    display: flex; gap: 8px; z-index: 2;
  }
  .type-badge {
    font-size: 11px; font-weight: 600;
    padding: 5px 12px; border-radius: 20px;
    font-family: 'Sora', sans-serif;
  }
  .badge-mess   { background: rgba(108,99,255,0.9); color: #fff; }
  .badge-sublet { background: rgba(59,130,246,0.9);  color: #fff; }
  .badge-seat   { background: rgba(16,185,129,0.9);  color: #fff; }
  .badge-male   { background: rgba(59,130,246,0.2); color: #93c5fd; border: 1px solid rgba(59,130,246,0.3); }
  .badge-female { background: rgba(236,72,153,0.2); color: #f9a8d4; border: 1px solid rgba(236,72,153,0.3); }
  .badge-any    { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.7); border: 1px solid rgba(255,255,255,0.15); }

  .detail-body { padding: 20px 20px 120px; }

  .title-row { margin-bottom: 8px; }
  .detail-title { font-size: 22px; font-weight: 700; font-family: 'Hind Siliguri', sans-serif; line-height: 1.3; margin-bottom: 6px; }
  .detail-area { font-size: 13px; color: rgba(255,255,255,0.45); font-family: 'Hind Siliguri', sans-serif; }

  .info-strip {
    display: flex; gap: 8px;
    margin: 16px 0;
    overflow-x: auto; scrollbar-width: none;
  }
  .info-strip::-webkit-scrollbar { display: none; }
  .info-chip {
    flex-shrink: 0;
    display: flex; align-items: center; gap: 5px;
    padding: 8px 12px; border-radius: 10px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    font-size: 12px; font-family: 'Hind Siliguri', sans-serif;
    color: rgba(255,255,255,0.65);
  }
  .info-chip .chip-icon { font-size: 14px; }

  .detail-section {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px;
    padding: 16px;
    margin-bottom: 14px;
  }
  .section-label {
    font-size: 12px; font-weight: 600;
    color: #6C63FF; letter-spacing: 1px;
    text-transform: uppercase;
    font-family: 'Sora', sans-serif;
    margin-bottom: 10px;
  }
  .section-text {
    font-size: 14px; line-height: 1.7;
    color: rgba(255,255,255,0.6);
    font-family: 'Hind Siliguri', sans-serif;
  }

  .amenity-grid { display: flex; flex-wrap: wrap; gap: 8px; }
  .amenity-tag {
    font-size: 12px; padding: 6px 12px;
    border-radius: 20px;
    background: rgba(108,99,255,0.12);
    color: rgba(167,139,250,0.9);
    border: 1px solid rgba(108,99,255,0.2);
    font-family: 'Hind Siliguri', sans-serif;
  }

  .owner-row {
    display: flex; align-items: center; gap: 12px;
  }
  .owner-avatar {
    width: 44px; height: 44px; border-radius: 50%;
    background: linear-gradient(135deg, #6C63FF, #FF6B6B);
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; flex-shrink: 0;
  }
  .owner-name { font-size: 15px; font-weight: 600; font-family: 'Hind Siliguri', sans-serif; margin-bottom: 3px; }
  .owner-phone { font-size: 12px; color: rgba(255,255,255,0.45); font-family: 'Hind Siliguri', sans-serif; }

  .sticky-footer {
    position: fixed; bottom: 0; left: 0; right: 0;
    background: rgba(13,13,26,0.96);
    backdrop-filter: blur(20px);
    border-top: 1px solid rgba(255,255,255,0.07);
    padding: 14px 20px 28px;
    display: flex; align-items: center; justify-content: space-between; gap: 12px;
    z-index: 100;
  }
  .price-block {}
  .price-amount {
    font-size: 24px; font-weight: 700;
    background: linear-gradient(135deg, #6C63FF, #FF6B6B);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .price-label { font-size: 11px; color: rgba(255,255,255,0.4); font-family: 'Hind Siliguri', sans-serif; }

  .msg-btn {
    flex: 1;
    padding: 14px;
    background: linear-gradient(135deg, #6C63FF, #8B83FF);
    border: none; border-radius: 14px;
    color: #fff; font-size: 14px; font-weight: 600;
    font-family: 'Hind Siliguri', sans-serif;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.1s;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .msg-btn:hover { opacity: 0.9; }
  .msg-btn:active { transform: scale(0.98); }

  .loading-screen {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    min-height: 60vh;
    color: rgba(255,255,255,0.3);
    font-family: 'Hind Siliguri', sans-serif;
    font-size: 15px; gap: 14px;
  }
  .loading-spinner {
    width: 36px; height: 36px;
    border: 3px solid rgba(108,99,255,0.2);
    border-top-color: #6C63FF;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .not-found {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    min-height: 60vh; gap: 12px;
    font-family: 'Hind Siliguri', sans-serif;
    color: rgba(255,255,255,0.35);
  }
  .not-found-icon { font-size: 48px; }
`;

const BG_CLASS = { mess: '', sublet: 'sublet', seat: 'seat' };

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/listings/${id}`)
      .then(r => { setListing(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <>
      <style>{styles}</style>
      <div className="detail-app">
        <div className="loading-screen">
          <div className="loading-spinner" />
          লোড হচ্ছে...
        </div>
      </div>
    </>
  );

  if (!listing) return (
    <>
      <style>{styles}</style>
      <div className="detail-app">
        <div className="not-found">
          <div className="not-found-icon">🔍</div>
          <div>লিস্টিং পাওয়া যায়নি</div>
          <button
            onClick={() => navigate(-1)}
            style={{ marginTop: 8, padding: '10px 20px', background: 'rgba(108,99,255,0.2)', border: '1px solid rgba(108,99,255,0.3)', borderRadius: 12, color: '#a78bfa', cursor: 'pointer', fontFamily: 'Hind Siliguri' }}
          >
            ফিরে যাও
          </button>
        </div>
      </div>
    </>
  );

  const bgClass = BG_CLASS[listing.type] || '';

  return (
    <>
      <style>{styles}</style>
      <div className="detail-app">

        {/* Hero Image */}
        <div className="detail-hero">
          <div className={`hero-bg ${bgClass}`}>🏠</div>
          <div className="hero-overlay" />
          <button className="back-btn" onClick={() => navigate(-1)}>←</button>
          <div className="fav-btn">🤍</div>
          <div className="hero-bottom">
            {listing.type && (
              <span className={`type-badge badge-${listing.type}`}>
                {listing.type === 'mess' ? 'মেস' : listing.type === 'sublet' ? 'সাবলেট' : 'সিট'}
              </span>
            )}
            {listing.gender && (
              <span className={`type-badge badge-${listing.gender}`}>
                {listing.gender === 'male' ? '👨 ছেলে' : listing.gender === 'female' ? '👩 মেয়ে' : '👥 যেকেউ'}
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="detail-body">

          {/* Title */}
          <div className="title-row">
            <div className="detail-title">{listing.title}</div>
            <div className="detail-area">📍 {listing.area}</div>
          </div>

          {/* Info Chips */}
          <div className="info-strip">
            {listing.beds && <div className="info-chip"><span className="chip-icon">🛏</span>{listing.beds} বেড</div>}
            {listing.baths && <div className="info-chip"><span className="chip-icon">🚿</span>{listing.baths} বাথ</div>}
            {listing.floor && <div className="info-chip"><span className="chip-icon">🏢</span>{listing.floor} তলা</div>}
            {listing.size && <div className="info-chip"><span className="chip-icon">📐</span>{listing.size} sqft</div>}
            {listing.available && <div className="info-chip"><span className="chip-icon">✅</span>খালি আছে</div>}
          </div>

          {/* Description */}
          {listing.description && (
            <div className="detail-section">
              <div className="section-label">বিবরণ</div>
              <div className="section-text">{listing.description}</div>
            </div>
          )}

          {/* Amenities */}
          {listing.amenities?.length > 0 && (
            <div className="detail-section">
              <div className="section-label">সুবিধাসমূহ</div>
              <div className="amenity-grid">
                {listing.amenities.map(a => (
                  <span key={a} className="amenity-tag">{a}</span>
                ))}
              </div>
            </div>
          )}

          {/* Owner */}
          {listing.owner && (
            <div className="detail-section">
              <div className="section-label">যোগাযোগ</div>
              <div className="owner-row">
                <div className="owner-avatar">👤</div>
                <div>
                  <div className="owner-name">{listing.owner.name}</div>
                  <div className="owner-phone">📞 {listing.owner.phone}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sticky Footer */}
        <div className="sticky-footer">
          <div className="price-block">
            <div className="price-amount">৳{listing.rent?.toLocaleString()}</div>
            <div className="price-label">প্রতি মাস</div>
          </div>
          <button className="msg-btn" onClick={() => navigate('/chat')}>
            💬 মেসেজ করো
          </button>
        </div>

      </div>
    </>
  );
}