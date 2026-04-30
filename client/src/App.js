import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Listings from './pages/Listings';
import ListingDetail from './pages/ListingDetail';
import RoommateMatch from './pages/RoommateMatch';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLayout from './admin/Layout';
import AdminDashboard from './admin/Dashboard';
import AdminListings from './admin/Listings';
import AdminUsers from './admin/Users';
import AdminSettings from './admin/Settings';
import AdminHome from './admin/Home';
import AdminAreas from './admin/Areas';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { useAuth } from './context/AuthContext';

function AdminRoute({ children }) {
  const { user } = useAuth();
  if (!user || user.role !== 'admin') return <Navigate to="/login" />;
  return children;
}

function UserLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* User Pages — Navbar + Footer সহ */}
        <Route path="/" element={<UserLayout><Home /></UserLayout>} />
        <Route path="/listings" element={<UserLayout><Listings /></UserLayout>} />
        <Route path="/listings/:id" element={<UserLayout><ListingDetail /></UserLayout>} />
        <Route path="/match" element={<UserLayout><RoommateMatch /></UserLayout>} />
        <Route path="/chat" element={<UserLayout><Chat /></UserLayout>} />
        <Route path="/profile" element={<UserLayout><Profile /></UserLayout>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Pages — Navbar নেই */}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="home" element={<AdminHome />} />
          <Route path="listings" element={<AdminListings />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="areas" element={<AdminAreas />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}