import React from 'react';
import BottomNav from '../components/BottomNav';

export default function Profile() {
  return (
    <div>
      <div className="page">
        <div style={{textAlign:'center',marginBottom:20}}>
          <div style={{width:72,height:72,borderRadius:36,background:'linear-gradient(135deg,#6C63FF,#764ba2)',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontSize:28,fontWeight:700,margin:'0 auto 10px'}}>র</div>
          <h2 style={{fontWeight:700}}>রাহাত হোসেন</h2>
          <p style={{color:'#718096'}}>BUET · CSE</p>
        </div>
        <div className="card">
          <h3 style={{marginBottom:12}}>আমার পছন্দ</h3>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
            {[['🚭','ধূমপান করি না'],['🌙','রাতে পড়ি'],['🤫','শান্ত থাকি'],['🕌','নামাজ পড়ি'],['🍖','নন-ভেজ'],['📚','পড়ুয়া']].map(([icon,label]) => (
              <div key={label} style={{background:'#F7FAFC',borderRadius:10,padding:'10px 12px',display:'flex',gap:8,alignItems:'center'}}>
                <span style={{fontSize:18}}>{icon}</span>
                <span style={{fontSize:13}}>{label}</span>
              </div>
            ))}
          </div>
        </div>
        <button className="btn btn-primary" style={{width:'100%',padding:14,fontSize:15}}>+ লিস্টিং পোস্ট করো</button>
      </div>
      <BottomNav />
    </div>
  );
}
