import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { listings } from '../data/mockData';
import BottomNav from '../components/BottomNav';

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const listing = listings.find(l => l._id === id);
  if (!listing) return <div className="page">পাওয়া যায়নি</div>;
  return (
    <div>
      <div className="page">
        <button onClick={() => navigate(-1)} style={{background:'none',border:'none',fontSize:20,cursor:'pointer',marginBottom:12}}>← ফিরে যাও</button>
        <div style={{background:'linear-gradient(135deg,#6C63FF,#764ba2)',borderRadius:16,height:160,display:'flex',alignItems:'center',justifyContent:'center',fontSize:60,marginBottom:16}}>🏠</div>
        <h2 style={{fontWeight:700,marginBottom:8}}>{listing.title}</h2>
        <p style={{color:'#718096',marginBottom:12}}>📍 {listing.area}</p>
        <div style={{display:'flex',gap:8,marginBottom:16}}>
          <span className={`badge badge-${listing.type}`}>{listing.type}</span>
          <span className={`badge badge-${listing.gender}`}>{listing.gender}</span>
        </div>
        <div className="card">
          <h3 style={{marginBottom:8}}>বিবরণ</h3>
          <p style={{color:'#718096'}}>{listing.description}</p>
        </div>
        <div className="card">
          <h3 style={{marginBottom:8}}>সুবিধা</h3>
          <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
            {listing.amenities.map(a => <span key={a} className="tag">{a}</span>)}
          </div>
        </div>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',background:'white',borderRadius:14,padding:16,boxShadow:'0 2px 8px rgba(0,0,0,0.06)'}}>
          <div><div style={{fontWeight:700,fontSize:22,color:'#6C63FF'}}>৳{listing.rent.toLocaleString()}</div><div style={{fontSize:12,color:'#718096'}}>প্রতি মাস</div></div>
          <button className="btn btn-primary" onClick={() => navigate('/chat')}>💬 মেসেজ করো</button>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
