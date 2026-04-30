import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Sora:wght@400;600;700&display=swap');

  .chat-wrap { background: #0D0D1A; min-height: calc(100vh - 64px); color: #fff; font-family: 'Sora', sans-serif; display: flex; }

  .chat-sidebar { width: 320px; min-width: 320px; border-right: 1px solid rgba(255,255,255,0.07); display: flex; flex-direction: column; }
  .chat-sidebar-header { padding: 20px 20px 16px; border-bottom: 1px solid rgba(255,255,255,0.07); }
  .chat-sidebar-title { font-size: 20px; font-weight: 700; font-family: 'Hind Siliguri', sans-serif; margin-bottom: 12px; }
  .chat-search { position: relative; }
  .chat-search input { width: 100%; padding: 10px 14px 10px 36px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: #fff; font-size: 13px; outline: none; box-sizing: border-box; font-family: 'Hind Siliguri', sans-serif; }
  .chat-search input::placeholder { color: rgba(255,255,255,0.3); }
  .chat-search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); font-size: 14px; opacity: 0.4; }

  .chat-list { flex: 1; overflow-y: auto; }
  .chat-item { display: flex; align-items: center; gap: 12px; padding: 14px 20px; cursor: pointer; transition: background 0.15s; border-bottom: 1px solid rgba(255,255,255,0.04); }
  .chat-item:hover { background: rgba(255,255,255,0.04); }
  .chat-item.active { background: rgba(108,99,255,0.12); border-right: 2px solid #6C63FF; }
  .chat-avatar { width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, #6C63FF, #FF6B6B); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 16px; flex-shrink: 0; }
  .chat-item-info { flex: 1; min-width: 0; }
  .chat-item-name { font-size: 14px; font-weight: 600; font-family: 'Hind Siliguri', sans-serif; margin-bottom: 3px; }
  .chat-item-last { font-size: 12px; color: rgba(255,255,255,0.4); font-family: 'Hind Siliguri', sans-serif; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .chat-item-right { text-align: right; flex-shrink: 0; }
  .chat-item-time { font-size: 11px; color: rgba(255,255,255,0.35); font-family: 'Hind Siliguri', sans-serif; }
  .chat-unread { background: #6C63FF; color: white; border-radius: 10px; padding: 2px 7px; font-size: 11px; margin-top: 4px; display: inline-block; }

  .chat-main { flex: 1; display: flex; flex-direction: column; }
  .chat-main-header { padding: 16px 24px; border-bottom: 1px solid rgba(255,255,255,0.07); display: flex; align-items: center; gap: 12px; }
  .chat-main-avatar { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #6C63FF, #FF6B6B); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 15px; }
  .chat-main-name { font-size: 16px; font-weight: 700; font-family: 'Hind Siliguri', sans-serif; }
  .chat-main-status { font-size: 12px; color: #10b981; font-family: 'Hind Siliguri', sans-serif; }

  .chat-messages { flex: 1; padding: 20px 24px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; }
  .msg { max-width: 60%; }
  .msg.me { align-self: flex-end; }
  .msg.other { align-self: flex-start; }
  .msg-bubble { padding: 12px 16px; border-radius: 16px; font-size: 14px; font-family: 'Hind Siliguri', sans-serif; line-height: 1.5; }
  .msg.me .msg-bubble { background: linear-gradient(135deg, #6C63FF, #8B83FF); color: white; border-bottom-right-radius: 4px; }
  .msg.other .msg-bubble { background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.9); border-bottom-left-radius: 4px; }
  .msg-time { font-size: 10px; color: rgba(255,255,255,0.3); margin-top: 4px; font-family: 'Hind Siliguri', sans-serif; }
  .msg.me .msg-time { text-align: right; }

  .chat-input-wrap { padding: 16px 24px; border-top: 1px solid rgba(255,255,255,0.07); display: flex; gap: 10px; }
  .chat-input { flex: 1; padding: 13px 16px; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; color: #fff; font-size: 14px; font-family: 'Hind Siliguri', sans-serif; outline: none; transition: border-color 0.2s; }
  .chat-input:focus { border-color: #6C63FF; }
  .chat-input::placeholder { color: rgba(255,255,255,0.35); }
  .chat-send-btn { padding: 13px 20px; background: linear-gradient(135deg, #6C63FF, #8B83FF); border: none; border-radius: 12px; color: white; font-size: 18px; cursor: pointer; transition: opacity 0.2s; }
  .chat-send-btn:hover { opacity: 0.88; }

  .chat-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; color: rgba(255,255,255,0.3); font-family: 'Hind Siliguri', sans-serif; gap: 12px; }
  .chat-empty div:first-child { font-size: 52px; }

  .login-prompt { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px; text-align: center; }
  .login-prompt h2 { font-size: 24px; font-weight: 700; font-family: 'Hind Siliguri', sans-serif; margin-bottom: 12px; }
  .login-prompt p { color: rgba(255,255,255,0.45); font-family: 'Hind Siliguri', sans-serif; margin-bottom: 24px; }
  .login-prompt-btn { padding: 14px 32px; background: linear-gradient(135deg, #6C63FF, #8B83FF); border: none; border-radius: 12px; color: white; font-size: 15px; font-weight: 700; cursor: pointer; }

  @media (max-width: 768px) {
    .chat-sidebar { width: 100%; min-width: unset; display: none; }
    .chat-sidebar.show { display: flex; }
  }
`;

const DEMO_CHATS = [
  { _id: 'c1', name: 'রাফি আহমেদ', lastMessage: 'ভাড়া কি কমবে?', time: '১০ মিনিট', unread: 2 },
  { _id: 'c2', name: 'তানভীর হাসান', lastMessage: 'কবে দেখতে আসবো?', time: '১ ঘন্টা', unread: 0 },
  { _id: 'c3', name: 'সাকিব রহমান', lastMessage: 'ধন্যবাদ!', time: 'গতকাল', unread: 0 },
];

export default function Chat() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([
    { from: 'other', text: 'হ্যালো! বাসা কি এখনো available?', time: '10:30' },
    { from: 'me', text: 'হ্যাঁ, এখনো available আছে।', time: '10:32' },
    { from: 'other', text: 'ভাড়া কি কমবে একটু?', time: '10:33' },
  ]);
  const [msg, setMsg] = useState('');
  const [chatSearch, setChatSearch] = useState('');

  const sendMsg = () => {
    if (!msg.trim()) return;
    setMessages([...messages, { from: 'me', text: msg, time: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }) }]);
    setMsg('');
  };

  if (!user) return (
    <>
      <style>{styles}</style>
      <div className="chat-wrap">
        <div className="login-prompt">
          <div style={{ fontSize: 52, marginBottom: 16 }}>💬</div>
          <h2>Login করো</h2>
          <p>চ্যাট করতে login করতে হবে</p>
          <button className="login-prompt-btn" onClick={() => navigate('/login')}>Login করো</button>
        </div>
      </div>
    </>
  );

  const filtered = DEMO_CHATS.filter(c =>
    chatSearch === '' || c.name.includes(chatSearch)
  );

  return (
    <>
      <style>{styles}</style>
      <div className="chat-wrap">

        {/* Sidebar */}
        <div className="chat-sidebar">
          <div className="chat-sidebar-header">
            <div className="chat-sidebar-title">💬 চ্যাট</div>
            <div className="chat-search">
              <span className="chat-search-icon">🔍</span>
              <input placeholder="খুঁজুন..." value={chatSearch}
                onChange={e => setChatSearch(e.target.value)} />
            </div>
          </div>
          <div className="chat-list">
            {filtered.map(c => (
              <div key={c._id} className={`chat-item ${active?._id === c._id ? 'active' : ''}`}
                onClick={() => setActive(c)}>
                <div className="chat-avatar">{c.name[0]}</div>
                <div className="chat-item-info">
                  <div className="chat-item-name">{c.name}</div>
                  <div className="chat-item-last">{c.lastMessage}</div>
                </div>
                <div className="chat-item-right">
                  <div className="chat-item-time">{c.time}</div>
                  {c.unread > 0 && <span className="chat-unread">{c.unread}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main */}
        <div className="chat-main">
          {active ? (
            <>
              <div className="chat-main-header">
                <div className="chat-main-avatar">{active.name[0]}</div>
                <div>
                  <div className="chat-main-name">{active.name}</div>
                  <div className="chat-main-status">● Online</div>
                </div>
              </div>
              <div className="chat-messages">
                {messages.map((m, i) => (
                  <div key={i} className={`msg ${m.from}`}>
                    <div className="msg-bubble">{m.text}</div>
                    <div className="msg-time">{m.time}</div>
                  </div>
                ))}
              </div>
              <div className="chat-input-wrap">
                <input className="chat-input" placeholder="মেসেজ লিখো..."
                  value={msg} onChange={e => setMsg(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMsg()} />
                <button className="chat-send-btn" onClick={sendMsg}>➤</button>
              </div>
            </>
          ) : (
            <div className="chat-empty">
              <div>💬</div>
              <div>একটা conversation select করো</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}