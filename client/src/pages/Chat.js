import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';
import API from '../api';

const socket = io(process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000');

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Sora:wght@400;600;700&display=swap');

  .chat-wrap { background: #0D0D1A; height: calc(100vh - 64px); color: #fff; font-family: 'Sora', sans-serif; display: flex; overflow: hidden; }

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
  .chat-item.active { background: rgba(108,99,255,0.12); border-right: 3px solid #6C63FF; }
  .chat-avatar { width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, #6C63FF, #FF6B6B); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 16px; flex-shrink: 0; }
  .chat-item-info { flex: 1; min-width: 0; }
  .chat-item-name { font-size: 14px; font-weight: 600; font-family: 'Hind Siliguri', sans-serif; margin-bottom: 3px; }
  .chat-item-last { font-size: 12px; color: rgba(255,255,255,0.4); font-family: 'Hind Siliguri', sans-serif; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .chat-unread { background: #6C63FF; color: white; border-radius: 10px; padding: 2px 7px; font-size: 11px; margin-top: 4px; display: inline-block; }

  .chat-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
  .chat-main-header { padding: 16px 24px; border-bottom: 1px solid rgba(255,255,255,0.07); display: flex; align-items: center; gap: 12px; }
  .chat-main-avatar { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #6C63FF, #FF6B6B); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 15px; }
  .chat-main-name { font-size: 16px; font-weight: 700; font-family: 'Hind Siliguri', sans-serif; }
  .chat-main-status { font-size: 12px; color: #10b981; font-family: 'Hind Siliguri', sans-serif; }

  .chat-messages { flex: 1; padding: 20px 24px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; }
  .msg { max-width: 65%; }
  .msg.me { align-self: flex-end; }
  .msg.other { align-self: flex-start; }
  .msg-bubble { padding: 11px 16px; border-radius: 16px; font-size: 14px; font-family: 'Hind Siliguri', sans-serif; line-height: 1.5; word-break: break-word; }
  .msg.me .msg-bubble { background: linear-gradient(135deg, #6C63FF, #8B83FF); color: white; border-bottom-right-radius: 4px; }
  .msg.other .msg-bubble { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.9); border-bottom-left-radius: 4px; }
  .msg-time { font-size: 10px; color: rgba(255,255,255,0.3); margin-top: 4px; font-family: 'Hind Siliguri', sans-serif; }
  .msg.me .msg-time { text-align: right; }

  .chat-input-wrap { padding: 16px 24px; border-top: 1px solid rgba(255,255,255,0.07); display: flex; gap: 10px; }
  .chat-input { flex: 1; padding: 13px 16px; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; color: #fff; font-size: 14px; font-family: 'Hind Siliguri', sans-serif; outline: none; transition: border-color 0.2s; }
  .chat-input:focus { border-color: #6C63FF; }
  .chat-input::placeholder { color: rgba(255,255,255,0.35); }
  .chat-send-btn { padding: 13px 20px; background: linear-gradient(135deg, #6C63FF, #8B83FF); border: none; border-radius: 12px; color: white; font-size: 18px; cursor: pointer; transition: opacity 0.2s; }
  .chat-send-btn:hover { opacity: 0.88; }

  .chat-empty-main { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; color: rgba(255,255,255,0.3); font-family: 'Hind Siliguri', sans-serif; gap: 12px; text-align: center; }
  .chat-empty-list { padding: 32px 20px; text-align: center; color: rgba(255,255,255,0.3); font-family: 'Hind Siliguri', sans-serif; font-size: 13px; }

  .login-prompt { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px; text-align: center; }
  .login-prompt h2 { font-size: 24px; font-weight: 700; font-family: 'Hind Siliguri', sans-serif; margin-bottom: 12px; }
  .login-prompt p { color: rgba(255,255,255,0.45); font-family: 'Hind Siliguri', sans-serif; margin-bottom: 24px; }
  .login-prompt-btn { padding: 14px 32px; background: linear-gradient(135deg, #6C63FF, #8B83FF); border: none; border-radius: 12px; color: white; font-size: 15px; font-weight: 700; cursor: pointer; }

  @media (max-width: 768px) {
    .chat-sidebar { width: 100%; min-width: unset; }
    .chat-main { display: none; }
    .chat-main.show { display: flex; }
  }
`;

export default function Chat() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState('');
  const [chatSearch, setChatSearch] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    const myId = user._id || user.id;
    socket.emit('join', myId);
    loadConversations();

    // Listing থেকে আসলে সেই owner open করো
    const params = new URLSearchParams(window.location.search);
    const toId = params.get('to');
    const toName = params.get('name');
    if (toId && toName) {
      const conv = { _id: toId, name: decodeURIComponent(toName) };
      setActive(conv);
      API.get(`/messages/${toId}`).then(r => setMessages(r.data)).catch(() => { });
    }

    socket.on('newMessage', (message) => {
      setMessages(prev => {
        if (prev.find(m => m._id === message._id)) return prev;
        return [...prev, message];
      });
      loadConversations();
    });

    return () => socket.off('newMessage');
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversations = async () => {
    try {
      const res = await API.get('/messages/conversations');
      setConversations(res.data);
    } catch { }
  };

  const openConversation = async (conv) => {
    setActive(conv);
    try {
      const res = await API.get(`/messages/${conv._id}`);
      setMessages(res.data);
      setConversations(prev =>
        prev.map(c => c._id === conv._id ? { ...c, unread: 0 } : c)
      );
    } catch { }
  };

  const sendMsg = () => {
    if (!msg.trim() || !active) return;
    const myId = user._id || user.id;
    socket.emit('sendMessage', {
      from: myId,
      to: active._id,
      text: msg.trim(),
    });
    setMsg('');
  };

  const formatTime = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' });
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

  const myId = user._id || user.id;
  const filtered = conversations.filter(c =>
    chatSearch === '' || c.name?.toLowerCase().includes(chatSearch.toLowerCase())
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
            {filtered.length === 0
              ? <div className="chat-empty-list">কোনো conversation নেই</div>
              : filtered.map(c => (
                <div key={c._id} className={`chat-item ${active?._id === c._id ? 'active' : ''}`}
                  onClick={() => openConversation(c)}>
                  <div className="chat-avatar">{c.name?.[0] || 'U'}</div>
                  <div className="chat-item-info">
                    <div className="chat-item-name">{c.name}</div>
                    <div className="chat-item-last">{c.lastMessage}</div>
                  </div>
                  {c.unread > 0 && <span className="chat-unread">{c.unread}</span>}
                </div>
              ))
            }
          </div>
        </div>

        {/* Main */}
        <div className="chat-main">
          {active ? (
            <>
              <div className="chat-main-header">
                <div className="chat-main-avatar">{active.name?.[0] || 'U'}</div>
                <div>
                  <div className="chat-main-name">{active.name}</div>
                  <div className="chat-main-status">● Online</div>
                </div>
              </div>
              <div className="chat-messages">
                {messages.length === 0 && (
                  <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontFamily: 'Hind Siliguri', fontSize: 13, marginTop: 20 }}>
                    কথা শুরু করো 👋
                  </div>
                )}
                {messages.map((m, i) => {
                  const isMe = (m.from?._id || m.from)?.toString() === myId?.toString();
                  return (
                    <div key={m._id || i} className={`msg ${isMe ? 'me' : 'other'}`}>
                      <div className="msg-bubble">{m.text}</div>
                      <div className="msg-time">{formatTime(m.createdAt)}</div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
              <div className="chat-input-wrap">
                <input className="chat-input" placeholder="মেসেজ লিখো..."
                  value={msg} onChange={e => setMsg(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMsg()} />
                <button className="chat-send-btn" onClick={sendMsg}>➤</button>
              </div>
            </>
          ) : (
            <div className="chat-empty-main">
              <div style={{ fontSize: 52 }}>💬</div>
              <div>বাম দিক থেকে একটা conversation select করো</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}