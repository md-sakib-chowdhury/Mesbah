import React, { useState, useEffect } from 'react';
import API from '../api';
import ListingCard from '../components/ListingCard';
import BottomNav from '../components/BottomNav';

export default function Listings() {
  const [listings, setListings] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const filters = [['all', 'সব'], ['mess', 'মেস'], ['sublet', 'সাবলেট'], ['seat', 'সিট']];

  useEffect(() => {
    const query = filter === 'all' ? '' : `?type=${filter}`;
    API.get(`/listings${query}`).then(r => { setListings(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, [filter]);

  return (
    <div>
      <div className="page">
        <h2 style={{ fontWeight: 700, marginBottom: 12 }}>সব লিস্টিং</h2>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          {filters.map(([val, label]) => (
            <span key={val} onClick={() => setFilter(val)}
              style={{ padding: '6px 14px', borderRadius: 20, fontSize: 12, cursor: 'pointer', background: filter === val ? '#6C63FF' : 'white', color: filter === val ? 'white' : '#718096', boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }}>
              {label}
            </span>
          ))}
        </div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#718096' }}>Loading...</div>
        ) : listings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#718096' }}>কোনো লিস্টিং নেই</div>
        ) : (
          <div className="listing-grid">
            {listings.map(l => <ListingCard key={l._id} listing={l} />)}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}