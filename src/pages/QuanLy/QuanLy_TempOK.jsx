import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
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

export default function QuanLy() {
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [selectedFunction, setSelectedFunction] = useState('');

  const handleLogin = () => {
    if (password === '@bc') {
      setLoginSuccess(true);
      setMessage('');
    } else {
      setMessage('Mật khẩu không chính xác!');
    }
  };

  const chucNangList = [
    { label: 'CHỐT SỐ LIỆU', code: 'CHOT', color: '#42a5f5' },
    { label: 'SỐ LIỆU TRONG NGÀY', code: 'SONGAY', color: '#66bb6a' },
    { label: 'ĐIỀU CHỈNH SUẤT ĂN', code: 'SUATAN', color: '#ffb300' },
    { label: 'XÓA DỮ LIỆU THEO NGÀY', code: 'XOANGAY', color: '#ef5350' },
    { label: 'THỐNG KÊ THEO NGÀY', code: 'TKNGAY', color: '#ab47bc' },
    { label: 'CHI TIẾT TỪNG THÁNG', code: 'TKTHANG', color: '#26c6da' },
    { label: 'TỔNG HỢP CẢ NĂM', code: 'TKNAM', color: '#8d6e63' },
    { label: 'CẬP NHẬT DANH SÁCH', code: 'CAPNHAT', color: '#5c6bc0' },
    { label: 'LẬP DANH SÁCH BÁN TRÚ', code: 'LAPDS', color: '#ec407a' },
    { label: 'TẢI DANH SÁCH LÊN', code: 'TAIDS', color: '#789262' },
  ];

  const renderSelectedFunction = () => {
    switch (selectedFunction) {
      case 'CHOT':
        return <ChotSoLieu onBack={() => setSelectedFunction('')} />;
      case 'SONGAY':
        return <SoLieuNgay onBack={() => setSelectedFunction('')} />;
      case 'SUATAN':
        return <DieuChinhSuatAn onBack={() => setSelectedFunction('')} />;
      case 'XOANGAY':
        return <XoaDLNgay onBack={() => setSelectedFunction('')} />;
      case 'TKNGAY':
        return <ThongkeNgay onBack={() => setSelectedFunction('')} />;
      case 'TKTHANG':
        return <ThongkeThang onBack={() => setSelectedFunction('')} />;
      case 'TKNAM':
        return <ThongkeNam onBack={() => setSelectedFunction('')} />;
      case 'CAPNHAT':
        return <CapNhatDS onBack={() => setSelectedFunction('')} />;
      case 'LAPDS':
        return <LapDanhSach onBack={() => setSelectedFunction('')} />;
      case 'TAIDS':
        return <TaiDanhSach onBack={() => setSelectedFunction('')} />;
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #e3f2fd, #bbdefb)',
        py: 6,
        px: 2,
      }}
    >
      {!loginSuccess ? (
        <Box maxWidth={360} mx="auto">
          <Card elevation={8} sx={{ p: 4, borderRadius: 4 }}>
            <Typography
              variant="h5"
              color="primary"
              fontWeight="bold"
              align="center"
              gutterBottom
              sx={{ borderBottom: '2px solid #1976d2', pb: 1, mb: 3 }}
            >
              ĐĂNG NHẬP QUẢN LÝ
            </Typography>
            <TextField
              label="Tên đăng nhập"
              fullWidth
              margin="normal"
              value="TH Bình Khánh"
              disabled
            />
            <TextField
              label="Mật khẩu"
              fullWidth
              margin="normal"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {message && <Alert severity="error" sx={{ mt: 2 }}>{message}</Alert>}
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3, fontWeight: 'bold', py: 1.2 }}
              onClick={handleLogin}
            >
              Đăng nhập
            </Button>
          </Card>
        </Box>
      ) : selectedFunction ? (
        <Box maxWidth={selectedFunction === 'CAPNHAT' ? 1000 : 700} mx="auto">
          <Card sx={{ p: 4, borderRadius: 4 }} elevation={10}>
            {renderSelectedFunction()}
          </Card>
        </Box>
      ) : (
        <>
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            fontWeight="bold"
            color="primary"
            sx={{
              textShadow: '2px 2px 5px rgba(0,0,0,0.1)',
              borderBottom: '3px solid #1976d2',
              pb: 1,
              mb: 4,
            }}
          >
            HỆ THỐNG QUẢN LÝ BÁN TRÚ
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            {chucNangList.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.code}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                  style={{ height: '100%' }}
                >
                  <Card
                    elevation={6}
                    sx={{
                      borderRadius: 3,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="h6"
                        align="center"
                        fontWeight="600"
                        color="text.primary"
                        gutterBottom
                      >
                        {item.label}
                      </Typography>
                      <Typography
                        variant="body2"
                        align="center"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        Nhấn để sử dụng chức năng này
                      </Typography>
                      <Button
                        variant="contained"
                        fullWidth
                        sx={{
                          backgroundColor: item.color,
                          fontWeight: 600,
                          '&:hover': {
                            backgroundColor: item.color,
                            filter: 'brightness(0.9)',
                          },
                        }}
                        onClick={() => setSelectedFunction(item.code)}
                      >
                        Chọn
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
}
