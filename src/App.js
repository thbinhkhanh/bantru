import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from 'react-router-dom';

import {
  Box,
  Typography,
  TextField,
  Menu,
  MenuItem,
  Button,
} from '@mui/material';

import { getDoc, setDoc, doc } from 'firebase/firestore';
import { db } from './firebase';

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
import HuongDan from './pages/HuongDan';

function App() {
  return (
    <Router>
      <Navigation />
      <div style={{ paddingTop: 0 }}>
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
          <Route path="/huongdan" element={<HuongDan />} />
          <Route path="/chucnang" element={<About />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

function Navigation() {
  const location = useLocation();
  const [selectedYear, setSelectedYear] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  const yearOptions = ['2024-2025', '2025-2026'];

  useEffect(() => {
    const fetchYear = async () => {
      try {
        const docRef = doc(db, 'YEAR', 'NAMHOC');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSelectedYear(data?.value || '2024-2025');
        } else {
          await setDoc(docRef, { value: '2024-2025' });
          setSelectedYear('2024-2025');
        }
      } catch (error) {
        console.error('Lỗi đọc năm học từ Firestore:', error);
      }
    };
    fetchYear();
  }, []);

  const handleYearChange = async (e) => {
    const newYear = e.target.value;
    setSelectedYear(newYear);
    try {
      await setDoc(doc(db, 'NAMHOC', 'current'), { nam: newYear });
    } catch (error) {
      console.error('Lỗi cập nhật năm học:', error);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const navItems = [
    { path: '/', name: 'Trang chủ' },
    { path: '/lop1', name: 'Lớp 1' },
    { path: '/lop2', name: 'Lớp 2' },
    { path: '/lop3', name: 'Lớp 3' },
    { path: '/lop4', name: 'Lớp 4' },
    { path: '/lop5', name: 'Lớp 5' },
    { path: '/dangnhap', name: 'Quản lý' },
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
        justifyContent: 'space-between',
        overflowX: 'auto',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flexWrap: 'nowrap',
          overflowX: 'auto',
          paddingRight: '8px',
          whiteSpace: 'nowrap',
        }}
      >
        <img
          src="/Logo.png"
          alt="Logo"
          style={{ height: '40px', marginRight: '16px', flexShrink: 0 }}
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
              whiteSpace: 'nowrap',
            }}
          >
            {item.name}
          </Link>
        ))}

        {/* Dropdown Giới thiệu */}
        <Button
          onClick={handleMenuOpen}
          style={{
            color: 'white',
            padding: '8px 12px',
            backgroundColor:
              location.pathname.includes('/gioithieu') ||
              location.pathname.includes('/huongdan') ||
              location.pathname.includes('/chucnang')
                ? '#1565c0'
                : 'transparent',
            borderBottom:
              location.pathname.includes('/gioithieu') ||
              location.pathname.includes('/huongdan') ||
              location.pathname.includes('/chucnang')
                ? '3px solid white'
                : 'none',
            borderRadius: '4px',
            textTransform: 'none',
            fontSize: '1rem',       // 👈 Thêm dòng này
            //fontWeight: 'bold',     // 👈 Và dòng này
          }}
        >
          Giới thiệu
        </Button>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem component={Link} to="/huongdan" onClick={handleMenuClose}>
            Hướng dẫn sử dụng
          </MenuItem>
          <MenuItem component={Link} to="/chucnang" onClick={handleMenuClose}>
            Giới thiệu chức năng
          </MenuItem>
        </Menu>
      </div>

      <Box
        sx={{
          display: {
            xs: 'none',
            sm: 'flex',
          },
          alignItems: 'center',
          gap: 1,
          flexShrink: 0,
        }}
      >
        <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
          Năm học:
        </Typography>
        <TextField
          value={selectedYear}
          onChange={handleYearChange}
          variant="outlined"
          size="small"
          disabled
          sx={{
            backgroundColor: 'white',
            minWidth: 100,
            maxWidth: 100,
            borderRadius: 1,
            '& .MuiOutlinedInput-root': {
              borderRadius: 1,
              height: '32px',
            },
          }}
          inputProps={{
            style: {
              color: '#1976d2',
              fontWeight: 'bold',
              textAlign: 'center',
              padding: '6px 8px',
              fontSize: '14px',
            },
          }}
        />
      </Box>
    </nav>
  );
}

export default App;
