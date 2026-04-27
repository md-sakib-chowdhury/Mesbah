import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Listings from './pages/Listings';
import Users from './pages/Users';
import Settings from './pages/Settings';
import Layout from './components/Layout';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('adminToken'));

  if (!token) return <Login onLogin={t => { localStorage.setItem('adminToken', t); setToken(t); }} />;

  return (
    <BrowserRouter>
      <Layout onLogout={() => { localStorage.removeItem('adminToken'); setToken(null); }}>
        <Routes>
          <Route path="/" element={<Dashboard token={token} />} />
          <Route path="/listings" element={<Listings token={token} />} />
          <Route path="/users" element={<Users token={token} />} />
          <Route path="/settings" element={<Settings token={token} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}