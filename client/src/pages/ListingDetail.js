import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Sora:wght@400;600;700&display=swap');

  .detail-app { font-family: 'Sora', sans-serif; background: #0D0D1A; min-height: 100vh; color: #fff; }

  .detail-hero { width: 100%; height: 320px; position: relative; overflow: hidden; }
  .hero-img { width: 100%; height: 100%; object-fit: cover; }
  .hero-bg { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 72px; background: linear-gradient(135deg, #1a1040, #2d1b69); }
  .hero-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(13,13,26,0.2) 0%, rgba(13,13,26,0.85) 100%); }

  .back-btn { position: absolute; top: 16px; left: 16px; width: 38px; height: 38px; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.15); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 18px; cursor: pointer; z-index: 2; color: #fff; transition: background 0.2s; }
  .back-btn:hover { background: rgba(108,99,255,0.5); }

  .img-counter { position: absolute; top: 16px; right: 16px; background: rgba(0,0,0,0.6); color: white; font-size: 12px; padding: 5px 10px; border-radius: 20px; z-index: 2; }
  .img-nav { position: absolute; bottom: 50%; transform: translateY(50%); z-index: 2; width: 32px; height: 32px; background: rgba(0,0,0,0.5); border: none; border-radius: 50%; color: white; cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center; }
  .img-nav.prev { left: 12px; }
  .img-nav.next { right: 12px; }

  .hero-bottom { position: absolute; bottom: 16px; left: 16px; right: 16px; display: flex; gap: 8px; z-index: 2; }
  .type-badge { font-size: 11px; font-weight: 600; padding: 5px 12px; border-radius: 20px; }
  .badge-mess { background: rgba(108,99,255,0.9); color: #fff; }
  .badge-sublet { background: rgba(59,130,246,0.9); color: #fff; }
  .badge-seat { background: rgba(16,185,129,0.9); color: #fff; }
  .badge-male { background: rgba(59,130,246,0.2); color: #93c5fd; border: 1px solid rgba(59,130,246,0.3); }
  .badge-female { background: rgba(236,72,153,0.2); color: #f9a8d4; border: 1px solid rgba(236,72,153,0.3); }
  .badge-any { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.7); border: 1px solid rgba(255,255,255,0.15); }

  .detail-body { max-width: 800px; margin: 0 auto; padding: 24px 24px 120px; }
  .detail-title { font-size: 24px; font-weight: 700; font-family: 'Hind Siliguri', sans-serif; margin-bottom: 6px; }
  .detail-area { font-size: 13px; color: rgba(255,255,255,0.45); font-family: 'Hind Siliguri', sans-serif; margin-bottom: 16px; }

  .info-strip { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
  .info-chip { display: flex; align-items: center; gap: 5px; padding: 8px 12px; border-radius: 10px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); font-size: 12px; font-family: 'Hind Siliguri', sans-serif; color: rgba(255,255,255,0.65); }

  .detail-section { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 18px 20px; margin-bottom: 14px; }
  .section-label { font-size: 12px; font-weight: 700; color: #a78bfa; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 12px; }
  .section-text { font-size: 14px; line-height: 1.8; color: rgba(255,255,255,0.6); font-family: 'Hind Siliguri', sans-serif; }

  .amenity-grid { display: flex; flex-wrap: wrap; gap: 8px; }
  .amenity-tag { font-size: 12px; padding: 6px 12px; border-radius: 20px; background: rgba(108,99,255,0.12); color: rgba(167,139,250,0.9); border: 1px solid rgba(108,99,255,0.2); font-family: 'Hind Siliguri', sans-serif; }

  .owner-row { display: flex; align-items: center; gap: 14px; }
  .owner-avatar { width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, #6C63FF, #FF6B6B); display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 700; color: white; flex-shrink: 0; }
  .owner-name { font-size: 15px; font-weight: 600; font-family: 'Hind Siliguri', sans-serif; margin-bottom: 3px; }
  .owner-phone { font-size: 12px; color: rgba(255,255,255,0.45); font-family: 'Hind Siliguri', sans-serif; }

  .sticky-footer { position: fixed; bottom: 0; left: 0; right: 0; background: rgba(13,13,26,0.97); backdrop-filter: blur(20px); border-top: 1px solid rgba(255,255,255,0.07); padding: 14px 24px 24px; display: flex; align-items: center; justify-content: space-between; gap: 12px; z-index: 100; }
  .price-amount { font-size: 26px; font-weight: 800; background: linear-gradient(135deg, #a78bfa, #60a5fa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .price-label { font-size: 11px; color: rgba(255,255,255,0.4); font-family: 'Hind Siliguri', sans-serif; }
  .msg-btn { flex: 1; padding: 14px; background: linear-gradient(135deg, #6C63FF, #8B83FF); border: none; border-radius: 14px; color: #fff; font-size: 15px; font-weight: 700; font-family: 'Hind Siliguri', sans-serif; cursor: pointer; transition: opacity 0.2s; }
  .msg-btn:hover { opacity: 0.88; }

  .loading-screen { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; color: rgba(255,255,255,0.3); font-family: 'Hind Siliguri', sans-serif; gap: 14px; }
  .loading-spinner { width: 36px; height: 36px; border: 3px solid rgba(108,99,255,0.2); border-top-color: #6C63FF; border-radius: 50%; animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  .toast { position: fixed; top: 80px; left: 50%; transform: translateX(-50%); background: rgba(72,187,120,0.95); color: white; padding: 12px 24px; border-radius: 12px; font-family: 'Hind Siliguri', sans-serif; font-size: 14px; font-weight: 600; z-index: 999; }
`;

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx] = useState(0);
  const [toast, setToast] = useState('');

  useEffect(() => {
    API.get(`/listings/${id}`)
      .then(r => { setListing(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const handleMessage = () => {
    if (!user) { navigate('/login'); return; }

    const ownerId = listing.owner?._id || listing.owner;
    const ownerName = listing.owner?.name || 'Owner';
    const myId = user._id || user.id;

    if (ownerId?.toString() === myId?.toString()) {
      showToast('এটা তোমার নিজের listing!');
      return;
    }

    navigate(`/chat?to=${ownerId}&name=${encodeURIComponent(ownerName)}`);
  };

  const images = listing?.images?.filter(Boolean) || [];

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
      <div className="detail-app" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', flexDirection: 'column', gap: 12, color: 'rgba(255,255,255,0.35)', fontFamily: 'Hind Siliguri' }}>
        <div style={{ fontSize: 48 }}>🔍</div>
        <div>লিস্টিং পাওয়া যায়নি</div>
        <button onClick={() => navigate(-1)} style={{ padding: '10px 20px', background: 'rgba(108,99,255,0.2)', border: '1px solid rgba(108,99,255,0.3)', borderRadius: 12, color: '#a78bfa', cursor: 'pointer' }}>ফিরে যাও</button>
      </div>
    </>
  );

  return (
    <>
      <style>{styles}</style>
      <div className="detail-app">
        {toast && <div className="toast">{toast}</div>}

        {/* Hero */}
        <div className="detail-hero">
          {images.length > 0
            ? <img className="hero-img" src={images[imgIdx]} alt={listing.title} />
            : <div className="hero-bg">🏠</div>
          }
          <div className="hero-overlay" />
          <button className="back-btn" onClick={() => navigate(-1)}>←</button>

          {images.length > 1 && (
            <>
              <span className="img-counter">{imgIdx + 1} / {images.length}</span>
              <button className="img-nav prev" onClick={() => setImgIdx(i => (i - 1 + images.length) % images.length)}>‹</button>
              <button className="img-nav next" onClick={() => setImgIdx(i => (i + 1) % images.length)}>›</button>
            </>
          )}

          <div className="hero-bottom">
            {listing.type && (
              <span className={`type-badge badge-${listing.type}`}>
                {listing.type === 'mess' ? '🏠 মেস' : listing.type === 'sublet' ? '🔑 সাবলেট' : '🛏 সিট'}
              </span>
            )}
            {listing.gender && (
              <span className={`type-badge badge-${listing.gender}`}>
                {listing.gender === 'male' ? '👨 ছেলে' : listing.gender === 'female' ? '👩 মেয়ে' : '👥 যেকেউ'}
              </span>
            )}
            {listing.availableFrom === 'এখনই' && (
              <span className="type-badge" style={{ background: 'rgba(16,185,129,0.9)', color: '#fff' }}>✓ এখনই খালি</span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="detail-body">
          <div className="detail-title">{listing.title}</div>
          <div className="detail-area">📍 {listing.area}</div>

          <div className="info-strip">
            {listing.beds && <div className="info-chip">🛏 {listing.beds} বেড</div>}
            {listing.baths && <div className="info-chip">🚿 {listing.baths} বাথ</div>}
            {listing.floor && <div className="info-chip">🏢 {listing.floor} তলা</div>}
            {listing.size && <div className="info-chip">📐 {listing.size} sqft</div>}
            <div className="info-chip">📅 {listing.availableFrom || 'এখনই'}</div>
          </div>

          {listing.description && (
            <div className="detail-section">
              <div className="section-label">📝 বিবরণ</div>
              <div className="section-text">{listing.description}</div>
            </div>
          )}

          {listing.amenities?.length > 0 && (
            <div className="detail-section">
              <div className="section-label">✨ সুবিধাসমূহ</div>
              <div className="amenity-grid">
                {listing.amenities.map(a => (
                  <span key={a} className="amenity-tag">{a}</span>
                ))}
              </div>
            </div>
          )}

          {listing.owner && (
            <div className="detail-section">
              <div className="section-label">👤 যোগাযোগ</div>
              <div className="owner-row">
                <div className="owner-avatar">
                  {listing.owner?.name?.[0] || '👤'}
                </div>
                <div>
                  <div className="owner-name">{listing.owner?.name || 'Owner'}</div>
                  {listing.owner?.phone && <div className="owner-phone">📞 {listing.owner.phone}</div>}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sticky Footer */}
        <div className="sticky-footer">
          <div>
            <div className="price-amount">৳{listing.rent?.toLocaleString()}</div>
            <div className="price-label">প্রতি মাস</div>
          </div>
          <button className="msg-btn" onClick={handleMessage}>
            💬 {user ? 'মেসেজ করো' : 'Login করে মেসেজ করো'}
          </button>
        </div>
      </div>
    </>
  );
}