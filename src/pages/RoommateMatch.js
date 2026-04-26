import React from 'react';
import { users } from '../data/mockData';
import BottomNav from '../components/BottomNav';

export default function RoommateMatch() {
  return (
    <div>
      <div className="page">
        <h2 style={{fontWeight:700,marginBottom:4}}>রুমমেট ম্যাচ 🤝</h2>
        <p style={{color:'#718096',marginBottom:16}}>তোমার সাথে মিলে এমন মানুষ</p>
        {users.map(u => (
          <div key={u._id} className="card">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
              <div style={{display:'flex',gap:10,alignItems:'center'}}>
                <div style={{width:44,height:44,borderRadius:22,background:'linear-gradient(135deg,#6C63FF,#764ba2)',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontWeight:700}}>{u.name[0]}</div>
                <div><div style={{fontWeight:700}}>{u.name}</div><div style={{fontSize:12,color:'#718096'}}>{u.university}</div></div>
              </div>
              <div style={{textAlign:'center'}}>
                <div style={{fontSize:22,fontWeight:700,color: u.matchScore>=70?'#48BB78':u.matchScore>=50?'#ECC94B':'#FC8181'}}>{u.matchScore}%</div>
                <div style={{fontSize:10,color:'#718096'}}>ম্যাচ</div>
              </div>
            </div>
            <div style={{background:'#F7FAFC',borderRadius:8,padding:8,display:'flex',gap:6,flexWrap:'wrap'}}>
              <span className="tag">{u.preferences.smoking ? '🚬 ধূমপায়ী' : '🚭 অধূমপায়ী'}</span>
              <span className="tag">{u.preferences.sleepSchedule === 'early' ? '🌅 সকাল' : '🌙 রাত'}</span>
              <span className="tag">{u.preferences.social === 'quiet' ? '🤫 শান্ত' : '🎉 সামাজিক'}</span>
              <span className="tag">{u.preferences.prayers ? '🕌 নামাজী' : '—'}</span>
            </div>
          </div>
        ))}
      </div>
      <BottomNav />
    </div>
  );
}
