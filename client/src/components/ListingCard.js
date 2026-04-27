import React from 'react';
import { useNavigate } from 'react-router-dom';
const typeLabels = { mess: 'মেস', sublet: 'সাবলেট', seat: 'সিট' };
const genderLabels = { male: 'ছেলে', female: 'মেয়ে', any: 'যেকেউ' };
export default function ListingCard({ listing }) {
  const navigate = useNavigate();
  return (
    <div className="listing-card-full" onClick={() => navigate(`/listings/${listing._id}`)}>
      <div className="lcf-thumb">🏠</div>
      <div className="lcf-info">
        <div className="lcf-title">{listing.title}</div>
        <div className="lcf-meta">
          {listing.area} · <span className={`badge badge-${listing.type}`}>{typeLabels[listing.type]}</span> · {genderLabels[listing.gender]}
        </div>
        <div className="lcf-tags">
          {listing.amenities.slice(0, 3).map(a => <span key={a} className="tag">{a}</span>)}
        </div>
      </div>
      <div className="lcf-right">
        <div className="lcf-rent">৳{listing.rent.toLocaleString()}</div>
        <div className="lcf-avail">{listing.availableFrom === 'এখনই' ? '✓ এখনই' : listing.availableFrom}</div>
      </div>
    </div>
  );
}
