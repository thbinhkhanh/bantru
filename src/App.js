import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from 'react-router-dom';

import Home from './pages/Home';
import Lop1 from './pages/Lop1';
import Lop2 from './pages/Lop2';
import Lop3 from './pages/Lop3';
import Lop4 from './pages/Lop4';
import Lop5 from './pages/Lop5';
import QuanLy from './pages/QuanLy';
import About from './pages/About';
import Admin from './Admin';
import DangNhap from './DangNhap';
import Footer from './pages/Footer';

export default function App() {
  return (
    <Router>
      <Navigation />
      {/* 👉 KHÔNG dùng paddingTop toàn cục nếu muốn Banner sát trên */}
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lop1" element={<Lop1 />} />
          <Route path="/lop2" element={<Lop2 />} />
          <Route path="/lop3" element={<Lop3 />} />
          <Route path="/lop4" element={<Lop4 />} />
          <Route path="/lop5" element={<Lop5 />} />
          <Route path="/dangnhap" element={<DangNhap />} />
          <Route path="/quanly" element={<QuanLy />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/gioithieu" element={<About />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

function Navigation() {
  const location = useLocation();

  const navItems = [
    { path: '/', name: 'Trang chủ' },
    { path: '/lop1', name: 'Lớp 1' },
    { path: '/lop2', name: 'Lớp 2' },
    { path: '/lop3', name: 'Lớp 3' },
    { path: '/lop4', name: 'Lớp 4' },
    { path: '/lop5', name: 'Lớp 5' },
    { path: '/dangnhap', name: 'Quản lý' },
    { path: '/gioithieu', name: 'Giới thiệu' },
  ];

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: '12px',
        background: '#1976d2',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        gap: '10px',
      }}
    >
      <img
        src="/Logo.png"
        alt="Logo"
        style={{ height: '40px', marginRight: '16px' }}
      />
      {navItems.map((item, index) => (
        <Link
          key={index}
          to={item.path}
          style={{
            color: 'white',
            textDecoration: 'none',
            padding: '8px 12px',
            backgroundColor:
              location.pathname === item.path ? '#1565c0' : 'transparent',
            borderBottom:
              location.pathname === item.path ? '3px solid white' : 'none',
            borderRadius: '4px',
            flexShrink: 0,
          }}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
}
