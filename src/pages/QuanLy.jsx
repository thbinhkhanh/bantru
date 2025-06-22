import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Grid, Card, Button, Stack, Tabs, Tab, Divider
} from '@mui/material';

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
import Banner from './Banner';

export default function QuanLy() {
  const [selectedFunction, setSelectedFunction] = useState('');
  const [tabIndex, setTabIndex] = useState(0);
  const loginRole = localStorage.getItem("loginRole");
  const navigate = useNavigate();

  const handleFunctionSelect = (code) => {
    if (code === 'ADMIN') {
      navigate('/admin');
    } else {
      setSelectedFunction(code);
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

  const quanTriHeThong = loginRole === 'admin'
    ? [{ label: 'QUẢN TRỊ HỆ THỐNG', code: 'ADMIN', color: '#42a5f5' }]
    : [];

  const chucNangNhom = [
    {
      icon: '/N1.png',
      title: 'QUẢN LÝ DỮ LIỆU',
      items: [
        { label: 'CHỐT SỐ LIỆU', code: 'CHOT', color: '#42a5f5' },
        { label: 'SỐ LIỆU TRONG NGÀY', code: 'SONGAY', color: '#66bb6a' },
        { label: 'ĐIỀU CHỈNH SUẤT ĂN', code: 'SUATAN', color: '#ffb300' },
        { label: 'XÓA DỮ LIỆU THEO NGÀY', code: 'XOANGAY', color: '#ef5350' },
        ...quanTriHeThong,
      ],
    },
    {
      icon: '/N2.png',
      title: 'THỐNG KÊ DỮ LIỆU',
      items: [
        { label: 'THỐNG KÊ THEO NGÀY', code: 'TKNGAY', color: '#ab47bc' },
        { label: 'CHI TIẾT TỪNG THÁNG', code: 'TKTHANG', color: '#26c6da' },
        { label: 'TỔNG HỢP CẢ NĂM', code: 'TKNAM', color: '#8d6e63' },
        ...quanTriHeThong,
      ],
    },
    {
      icon: '/N3.png',
      title: 'DANH SÁCH HỌC SINH',
      items: [
        { label: 'CẬP NHẬT DANH SÁCH', code: 'CAPNHAT', color: '#5c6bc0' },
        { label: 'LẬP DANH SÁCH BÁN TRÚ', code: 'LAPDS', color: '#ec407a' },
        { label: 'TẢI DANH SÁCH LÊN', code: 'TAIDS', color: '#789262' },
        ...quanTriHeThong,
      ],
    },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #e3f2fd, #bbdefb)',
        px: 0,
        py: 0,
      }}
    >
      <Banner title="HỆ THỐNG QUẢN LÝ" />
      <Box sx={{ px: 2, pt: 3, pb: 6 }}>
        {selectedFunction ? (
          <Box maxWidth={700} mx="auto">
            {renderSelectedFunction()}
          </Box>
        ) : (
          <Card
            elevation={8}
            sx={{
              maxWidth: 600,
              mx: 'auto',
              borderRadius: 4,
              px: 2,
              py: 3,
              backgroundColor: 'white',
            }}
          >
            <Tabs
              value={tabIndex}
              onChange={(e, newIndex) => setTabIndex(newIndex)}
              variant="fullWidth"
              textColor="primary"
              indicatorColor="primary"
              sx={{
                mb: 2,
                '& .MuiTab-root': {
                  fontWeight: 600,
                  fontSize: 15,
                  minHeight: 42,
                },
              }}
            >
              {chucNangNhom.map((nhom, index) => (
                <Tab key={index} label={nhom.title} />
              ))}
            </Tabs>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={2} alignItems="center">
              <Box
                component="img"
                src={chucNangNhom[tabIndex].icon}
                alt="icon"
                sx={{ width: 80, height: 80 }}
              />
              {chucNangNhom[tabIndex].items.map((item) => (
                <Box key={item.code} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Button
                    variant="contained"
                    onClick={() => handleFunctionSelect(item.code)}
                    sx={{
                      backgroundColor: item.color,
                      fontWeight: 600,
                      minWidth: 250, // ✅ Giảm chiều rộng
                      height: 40,     // ✅ Giảm chiều cao
                      fontSize: 15,   // ✅ Giảm cỡ chữ
                      px: 2,
                      '&:hover': {
                        backgroundColor: item.color,
                        filter: 'brightness(0.9)',
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                </Box>
              ))}

            </Stack>
          </Card>
        )}
      </Box>
    </Box>
  );
}
