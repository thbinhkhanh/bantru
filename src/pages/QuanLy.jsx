// src/QuanLy.jsx
import React, { useState } from 'react';
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

export default function QuanLy() {
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [selectedFunction, setSelectedFunction] = useState('');

  const [adminVisible, setAdminVisible] = useState(false);
  const [firestoreEnabled, setFirestoreEnabled] = useState(false);

  const handleLogin = () => {
    if (password === '@bc') {
      setLoginSuccess(true);
      setMessage('');
    } else {
      setMessage('Mật khẩu không chính xác!');
    }
  };

  const handleFunctionSelect = (code) => {
    switch (code) {
      case 'ADMINLOGIN':
        setAdminVisible(true);
        break;
      default:
        setSelectedFunction(code);
        break;
    }
  };

  const chucNangNhom = [
    {
      icon: <img src="/N1.png" alt="N1" width={36} height={36} />,
      title: 'QUẢN LÝ DỮ LIỆU NGÀY',
      items: [
        { label: 'CHỐT SỐ LIỆU', code: 'CHOT', color: '#42a5f5' },
        { label: 'SỐ LIỆU TRONG NGÀY', code: 'SONGAY', color: '#66bb6a' },
        { label: 'ĐIỀU CHỈNH SUẤT ĂN', code: 'SUATAN', color: '#ffb300' },
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
        { label: 'ĐĂNG NHẬP HỆ THỐNG', code: 'ADMINLOGIN', color: '#455a64' },
      ],
    },
  ];

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

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #e3f2fd, #bbdefb)', py: 6, px: 2 }}>
      {!loginSuccess ? (
        <Box maxWidth={360} mx="auto">
          <Card elevation={8} sx={{ p: 4, borderRadius: 4 }}>
            <Typography variant="h5" color="primary" fontWeight="bold" align="center" gutterBottom sx={{ borderBottom: '2px solid #1976d2', pb: 1, mb: 3 }}>
              ĐĂNG NHẬP QUẢN LÝ
            </Typography>
            <TextField label="Tên đăng nhập" fullWidth margin="normal" value="TH Bình Khánh" disabled />
            <TextField label="Mật khẩu" fullWidth margin="normal" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {message && <Alert severity="error" sx={{ mt: 2 }}>{message}</Alert>}
            <Button variant="contained" color="primary" fullWidth sx={{ mt: 3, fontWeight: 'bold', py: 1.2 }} onClick={handleLogin}>
              Đăng nhập
            </Button>
          </Card>
        </Box>
      ) : selectedFunction ? (
        <Box maxWidth={selectedFunction === 'CAPNHAT' ? 1000 : 700} mx="auto">
          {renderSelectedFunction()}
        </Box>
      ) : adminVisible ? (
        <AdminLogin
          onSuccess={() => setFirestoreEnabled(true)}
          onCancel={() => setAdminVisible(false)}
        />
      ) : (
        <>
          <Typography variant="h4" align="center" gutterBottom fontWeight="bold" color="primary" sx={{ textShadow: '2px 2px 5px rgba(0,0,0,0.1)', borderBottom: '3px solid #1976d2', pb: 1, mb: 4 }}>
            HỆ THỐNG QUẢN LÝ BÁN TRÚ
          </Typography>

          <Box display="flex" flexDirection="column" alignItems="center">
            <Stack spacing={4} alignItems="center">
              {chucNangNhom.map((nhom, index) => (
                nhom.items.length > 0 && (
                  <Card key={index} elevation={6} sx={{ p: 3, borderRadius: 4, width: '100%', maxWidth: { xs: 360, sm: 720, md: 1055 }, mx: 'auto' }}>
                    <Grid
                      container
                      spacing={3}
                      direction={nhom.title === 'QUẢN LÝ HỆ THỐNG' ? { xs: 'column', sm: 'row' } : 'row'}
                      alignItems="center"
                      justifyContent="flex-start"
                      textAlign={nhom.title === 'QUẢN LÝ HỆ THỐNG' ? { xs: 'center', sm: 'left' } : { xs: 'center', sm: 'left' }}
                    >
                      <Grid item xs={12} sm={2} md={1} textAlign="center">
                        <Box component="img" src={nhom.icon.props.src} alt={nhom.icon.props.alt} sx={{ width: { xs: 90, sm: 100, md: 95 }, height: { xs: 90, sm: 100, md: 95 }, objectFit: 'contain', mx: 'auto' }} />
                      </Grid>
                      <Grid item xs={12} sm={10} md={11}>
                        <Typography variant="h6" fontWeight="bold" mb={2} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                          {nhom.title}
                        </Typography>
                        <Grid container spacing={2} justifyContent={{ xs: 'center', sm: 'flex-start' }}>
                          {nhom.items.map((item) => (
                            <Grid item xs={12} sm={6} md={4} key={item.code}>
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.2 }}>
                                <Button
                                  variant="contained"
                                  fullWidth
                                  sx={{
                                    minWidth: 220,
                                    backgroundColor: item.color,
                                    fontWeight: 600,
                                    height: 48,
                                    '&:hover': { backgroundColor: item.color, filter: 'brightness(0.9)' },
                                  }}
                                  onClick={() => handleFunctionSelect(item.code)}
                                >
                                  {item.label}
                                </Button>
                              </motion.div>
                            </Grid>
                          ))}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Card>
                )
              ))}
            </Stack>
          </Box>
        </>
      )}
    </Box>
  );
}
