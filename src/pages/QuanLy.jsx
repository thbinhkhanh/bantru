import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Card, TextField, Button, Alert, Stack
} from '@mui/material';
import { motion } from 'framer-motion';

import ChotSoLieu from '../ChotSoLieu';
import SoLieuNgay from '../SoLieuNgay';
import DieuChinhSuatAn from '../DieuChinhSuatAn';
import XoaDLNgay from '../XoaDLNgay';
import ThongkeNgay from '../ThongKeNgay';
import ThongkeThang from '../ThongKeThang';
import ThongkeNam from '../ThongKeNam';
import CapNhatDS from '../CapNhatDS';
import LapDanhSach from '../LapDanhSach';
import TaiDanhSach from '../TaiDanhSach';
import AdminLogin from "../AdminLogin";
import Banner from './Banner2';

// 🔽 Firebase import
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function QuanLy() {
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [selectedFunction, setSelectedFunction] = useState('');
  const [adminVisible, setAdminVisible] = useState(false);

  const [savedUserPassword, setSavedUserPassword] = useState('@bc'); // mặc định

  // 🔽 Lấy mật khẩu từ Firestore
  useEffect(() => {
    const fetchUserPassword = async () => {
      try {
        const userSnap = await getDoc(doc(db, 'SETTINGS', 'USER'));
        if (userSnap.exists()) {
          setSavedUserPassword(userSnap.data().password || '@bc');
        }
      } catch (err) {
        console.error('❌ Lỗi khi lấy mật khẩu USER:', err);
      }
    };
    fetchUserPassword();
  }, []);

  const handleLogin = () => {
    if (password === savedUserPassword) {
      setLoginSuccess(true);
      setMessage('');
    } else {
      setMessage('Mật khẩu không chính xác!');
    }
  };

  const handleFunctionSelect = (code) => {
    if (code === 'ADMINLOGIN') {
      setAdminVisible(true);
      setSelectedFunction('');
    } else {
      setSelectedFunction(code);
      setAdminVisible(false);
    }
  };

  const renderSelectedFunction = () => {
    switch (selectedFunction) {
      case 'CHOT': return <ChotSoLieu onBack={() => setSelectedFunction('')} />;
      case 'SONGAY': return <SoLieuNgay onBack={() => setSelectedFunction('')} />;
      case 'SUATAN': return <DieuChinhSuatAn onBack={() => setSelectedFunction('')} />;
      case 'XOANGAY': return <XoaDLNgay onBack={() => setSelectedFunction('')} />;
      case 'TKNGAY': return <ThongkeNgay onBack={() => setSelectedFunction('')} />;
      case 'TKTHANG': return <ThongkeThang onBack={() => setSelectedFunction('')} />;
      case 'TKNAM': return <ThongkeNam onBack={() => setSelectedFunction('')} />;
      case 'CAPNHAT': return <CapNhatDS onBack={() => setSelectedFunction('')} />;
      case 'LAPDS': return <LapDanhSach onBack={() => setSelectedFunction('')} />;
      case 'TAIDS': return <TaiDanhSach onBack={() => setSelectedFunction('')} />;
      default: return null;
    }
  };

  const chucNangNhom = [
    {
      icon: <img src="/N1.png" alt="N1" width={36} height={36} />,
      title: 'QUẢN LÝ DỮ LIỆU NGÀY',
      items: [
        { label: 'CHỐT SỐ LIỆU', code: 'CHOT', color: '#42a5f5' },
        { label: 'SỐ LIỆU TRONG NGÀY', code: 'SONGAY', color: '#66bb6a' },
        { label: 'ĐIỀU CHỈNH SUẤT Ăn', code: 'SUATAN', color: '#ffb300' },
        { label: 'XÓA DỮ LIỆU THEO NGÀY', code: 'XOANGAY', color: '#ef5350' },
      ],
    },
    {
      icon: <img src="/N2.png" alt="N2" width={36} height={36} />,
      title: 'THỐNG KÊ',
      items: [
        { label: 'THỐNG KÊ THEO NGÀY', code: 'TKNGAY', color: '#ab47bc' },
        { label: 'CHI TIẾT TỪNG THÁNG', code: 'TKTHANG', color: '#26c6da' },
        { label: 'TỔNG HỢP CẢ NĂM', code: 'TKNAM', color: '#8d6e63' },
      ],
    },
    {
      icon: <img src="/N3.png" alt="N3" width={36} height={36} />,
      title: 'DANH SÁCH HỌC SINH',
      items: [
        { label: 'CẬP NHẬT DANH SÁCH', code: 'CAPNHAT', color: '#5c6bc0' },
        { label: 'LẬP DANH SÁCH BÁN TRÚ', code: 'LAPDS', color: '#ec407a' },
        { label: 'TẢI DANH SÁCH LÊN', code: 'TAIDS', color: '#789262' },
      ],
    },
    {
      icon: <img src="/Set.jpg" alt="Admin" width={36} height={36} />,
      title: 'QUẢN LÝ HỆ THỐNG',
      items: [
        { label: 'ĐĂNG NHẬP HỆ THỐNG', code: 'ADMINLOGIN', color: '#42a5f5' },
      ],
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #e3f2fd, #bbdefb)', pt: 0, pb: 6, px: 2 }}>
      <Banner />

      {!loginSuccess ? (
        <Box maxWidth={400} mx="auto" mt={8}>
          <Card elevation={10} sx={{
            p: 4,
            borderRadius: 3,
            backgroundColor: '#ffffff',
            boxShadow: 3,
          }}>
            <Stack spacing={3}>
              <Box textAlign="center">
                <Typography variant="h5" fontWeight="bold" color="primary" sx={{ mb: 2 }}>
                  🔐 ĐĂNG NHẬP QUẢN LÝ
                </Typography>
              </Box>

              <TextField label="👤 Tên đăng nhập" value="TH Bình Khánh" fullWidth disabled />
              <TextField label="🔒 Mật khẩu" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />

              {message && <Alert severity="error" variant="filled">{message}</Alert>}

              <Button variant="contained" fullWidth color="primary" onClick={handleLogin} sx={{ height: 40, fontWeight: 'bold', fontSize: '16px' }}>
                🔓 Đăng nhập
              </Button>
            </Stack>
          </Card>
        </Box>
      ) : selectedFunction ? (
        <Box maxWidth={selectedFunction === 'CAPNHAT' ? 1000 : 700} mx="auto">
          {renderSelectedFunction()}
        </Box>
      ) : adminVisible ? (
        <AdminLogin onSuccess={() => setAdminVisible(false)} onCancel={() => setAdminVisible(false)} />
      ) : (
        <Stack spacing={1.4} alignItems="center">
          {chucNangNhom.map((nhom, index) => (
            <Card key={index} elevation={6} sx={{ p: 3, borderRadius: 4, width: '100%', maxWidth: { xs: 360, sm: 720, md: 1055 }, mx: 'auto' }}>
              <Grid container spacing={3} direction={{ xs: 'column', sm: 'row' }} alignItems="center">
                <Grid item xs={12} sm={2} md={1} textAlign="center">
                  <Box component="img" src={nhom.icon.props.src} alt={nhom.icon.props.alt} sx={{ width: { xs: 90, sm: 100, md: 95 }, height: 90, objectFit: 'contain', mx: 'auto' }} />
                </Grid>
                <Grid item xs={12} sm={10} md={11}>
                  <Typography variant="h6" fontWeight="bold" mb={2} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                    {nhom.title}
                  </Typography>
                  <Grid container spacing={2} direction={{ xs: 'column', sm: 'row' }}>
                    {nhom.items.map(item => (
                      <Grid item xs={12} sm={6} md={4} key={item.code}>
                        <Button
                          variant="contained"
                          fullWidth
                          sx={{
                            minWidth: 220,
                            backgroundColor: item.color,
                            fontWeight: 600,
                            height: 48,
                            '&:hover': {
                              backgroundColor: item.color,
                              filter: 'brightness(0.9)',
                            },
                          }}
                          onClick={() => handleFunctionSelect(item.code)}
                        >
                          {item.label}
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
}
