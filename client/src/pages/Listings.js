import React, { useState } from 'react';
import { listings } from '../data/mockData';
import ListingCard from '../components/ListingCard';
import BottomNav from '../components/BottomNav';

export default function Listings() {
  const [filter, setFilter] = useState('all');
  const filters = [['all','সব'],['mess','মেস'],['sublet','সাবলেট'],['seat','সিট']];
  const filtered = filter === 'all' ? listings : listings.filter(l => l.type === filter);
  return (
    <div>
      <div className="page">
        <h2 style={{fontWeight:700,marginBottom:12}}>সব লিস্টিং</h2>
        <div style={{display:'flex',gap:8,marginBottom:16,flexWrap:'wrap'}}>
          {filters.map(([val,label]) => (
            <span key={val} onClick={() => setFilter(val)} style={{padding:'6px 14px',borderRadius:20,fontSize:12,cursor:'pointer',background: filter===val ? '#6C63FF' : 'white',color: filter===val ? 'white' : '#718096',boxShadow:'0 2px 6px rgba(0,0,0,0.08)'}}>{label}</span>
          ))}
        </div>
        {filtered.map(l => <ListingCard key={l._id} listing={l} />)}
      </div>
      <BottomNav />
    </div>
  );
}
