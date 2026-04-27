import React, { useState } from 'react';
import { chats } from '../data/mockData';
import BottomNav from '../components/BottomNav';

export default function Chat() {
  const [active, setActive] = useState(null);
  const [msg, setMsg] = useState('');
  const [messages, setMessages] = useState([{from:'other',text:'হ্যালো! বাসা কি এখনো available?'}]);

  if (active) return (
    <div style={{display:'flex',flexDirection:'column',height:'100vh'}}>
      <div style={{padding:16,background:'white',borderBottom:'1px solid #E2E8F0',display:'flex',alignItems:'center',gap:10}}>
        <button onClick={() => setActive(null)} style={{background:'none',border:'none',fontSize:20,cursor:'pointer'}}>←</button>
        <div style={{width:36,height:36,borderRadius:18,background:'linear-gradient(135deg,#6C63FF,#764ba2)',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontWeight:700}}>{active.name[0]}</div>
        <span style={{fontWeight:700}}>{active.name}</span>
      </div>
      <div style={{flex:1,padding:16,overflowY:'auto',display:'flex',flexDirection:'column',gap:8}}>
        {messages.map((m,i) => (
          <div key={i} style={{alignSelf:m.from==='me'?'flex-end':'flex-start',background:m.from==='me'?'#6C63FF':'white',color:m.from==='me'?'white':'#2D3748',padding:'10px 14px',borderRadius:14,maxWidth:'75%',boxShadow:'0 2px 6px rgba(0,0,0,0.08)'}}>{m.text}</div>
        ))}
      </div>
      <div style={{padding:12,background:'white',borderTop:'1px solid #E2E8F0',display:'flex',gap:8}}>
        <input className="input" value={msg} onChange={e=>setMsg(e.target.value)} placeholder="মেসেজ লিখো..." style={{flex:1}} onKeyDown={e=>{if(e.key==='Enter'&&msg){setMessages([...messages,{from:'me',text:msg}]);setMsg('');}}} />
        <button className="btn btn-primary" onClick={()=>{if(msg){setMessages([...messages,{from:'me',text:msg}]);setMsg('');}}}>পাঠাও</button>
      </div>
    </div>
  );

  return (
    <div>
      <div className="page">
        <h2 style={{fontWeight:700,marginBottom:16}}>চ্যাট 💬</h2>
        {chats.map(c => (
          <div key={c._id} className="card" style={{display:'flex',gap:12,alignItems:'center',cursor:'pointer'}} onClick={() => setActive(c)}>
            <div style={{width:44,height:44,borderRadius:22,background:'linear-gradient(135deg,#6C63FF,#764ba2)',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontWeight:700,flexShrink:0}}>{c.name[0]}</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:700}}>{c.name}</div>
              <div style={{fontSize:13,color:'#718096'}}>{c.lastMessage}</div>
            </div>
            <div style={{textAlign:'right'}}>
              <div style={{fontSize:11,color:'#718096'}}>{c.time}</div>
              {c.unread>0 && <div style={{background:'#6C63FF',color:'white',borderRadius:10,padding:'2px 7px',fontSize:11,marginTop:4}}>{c.unread}</div>}
            </div>
          </div>
        ))}
      </div>
      <BottomNav />
    </div>
  );
}
