import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';

import Home from './pages/Home';
import Lop1 from './pages/Lop1';
import Lop2 from './pages/Lop2';
import Lop3 from './pages/Lop3';
import Lop4 from './pages/Lop4';
import Lop5 from './pages/Lop5';
import QuanLy from './pages/QuanLy';

export default function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lop1" element={<Lop1 />} />
        <Route path="/lop2" element={<Lop2 />} />
        <Route path="/lop3" element={<Lop3 />} />
        <Route path="/lop4" element={<Lop4 />} />
        <Route path="/lop5" element={<Lop5 />} />
        <Route path="/quanly" element={<QuanLy />} />
      </Routes>
    </Router>
  );
}

function Navigation() {
  const location = useLocation(); // Xác định trang hiện tại

  // Define an array of objects for better readability and mapping
  const navItems = [
    { path: '/', name: 'Trang chủ' },
    { path: '/lop1', name: 'Lớp 1' },
    { path: '/lop2', name: 'Lớp 2' },
    { path: '/lop3', name: 'Lớp 3' },
    { path: '/lop4', name: 'Lớp 4' },
    { path: '/lop5', name: 'Lớp 5' },
    { path: '/quanly', name: 'Quản lý' }, // Corrected name for '/quanly'
  ];

  return (
    <nav style={{ padding: '12px', background: '#1976d2', color: 'white', marginBottom: '20px' }}>
      {navItems.map((item, index) => (
        <Link
          key={index}
          to={item.path}
          style={{
            marginRight: '10px',
            color: 'white',
            textDecoration: 'none',
            padding: '8px 12px',
            backgroundColor: location.pathname === item.path ? '#1565c0' : 'transparent',
            borderBottom: location.pathname === item.path ? '3px solid white' : 'none',
            borderRadius: '4px',
          }}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
}