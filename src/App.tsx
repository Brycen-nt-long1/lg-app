import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Search from './pages/Search';
import TicketAddress from './pages/TicketAddress';
import Navbar, { NavBarItem } from './components/Navbar';
import './App.css';

const navItems: NavBarItem[] = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Search', href: '/search' },
  { label: 'Address', href: '/address' }
];

function AppLayout() {
  const location = useLocation();
  const showNavbar = location.pathname !== '/login';
  return (
    <>
      {showNavbar && <Navbar items={navItems} />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/search" element={<Search />} />
        <Route path="/address" element={<TicketAddress />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
