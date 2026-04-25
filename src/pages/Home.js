import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listings } from '../data/mockData';
import ListingCard from '../components/ListingCard';
import BottomNav from '../components/BottomNav';

export default function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedArea, setSelectedArea] = useState('');

  const areas = ['মিরপুর', 'ধানমন্ডি', 'উত্তরা', 'মোহাম্মদপুর'];

  const filtered = listings.filter(l => {
    const matchSearch = search === '' || l.title.includes(search) || l.area.includes(search);
    const matchArea = selectedArea === '' || l.area === selectedArea;
    return matchSearch && matchArea;
  });

  return (
    <div>
      <div className="page">
        <div style={{background:'linear-gradient(135deg,#6C63FF,#764ba2)',borderRadius:16,padding:20,color:'white',marginBottom:16}}>
          <h2 style={{fontSize:22,marginBottom:4}}>🏠 মেসবাহ</h2>
          <p style={{opacity:0.85,marginBottom:12}}>তোমার পছন্দের মেস খোঁজো</p>
          <input
            className="input"
            placeholder="এলাকা বা মেসের নাম লিখো..."
            style={{background:'white',color:'#333'}}
            value={search}
            onChange={e => { setSearch(e.target.value); setSelectedArea(''); }}
          />
        </div>
        <div style={{display:'flex',gap:8,marginBottom:16,flexWrap:'wrap'}}>
          {areas.map(a => (
            <span key={a} onClick={() => { setSelectedArea(selectedArea === a ? '' : a); setSearch(''); }}
              style={{background: selectedArea===a ? '#6C63FF' : 'white', color: selectedArea===a ? 'white' : '#333', padding:'6px 12px',borderRadius:20,fontSize:13,cursor:'pointer',boxShadow:'0 2px 6px rgba(0,0,0,0.08)',transition:'all 0.2s'}}>
              {a}
            </span>
          ))}
        </div>
        <h3 style={{marginBottom:12,fontWeight:700}}>
          {filtered.length === 0 ? '❌ কোনো লিস্টিং পাওয়া যায়নি' : `${filtered.length}টি লিস্টিং পাওয়া গেছে`}
        </h3>
        <div className="listing-grid">
          {filtered.map(l => <ListingCard key={l._id} listing={l} />)}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
