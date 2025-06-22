import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Grid, Card, CardContent, Button, Tabs, Tab
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
import Banner from './Banner';

// MUI Icons
import LockIcon from '@mui/icons-material/Lock';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LunchDiningIcon from '@mui/icons-material/LunchDining'; // ✅ NEW ICON
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import BarChartIcon from '@mui/icons-material/BarChart';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import TimelineIcon from '@mui/icons-material/Timeline';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import StorageIcon from '@mui/icons-material/Storage';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';

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
    ? [{
        label: 'QUẢN TRỊ HỆ THỐNG',
        code: 'ADMIN',
        color: '#42a5f5',
        icon: <AdminPanelSettingsIcon sx={{ fontSize: 50, color: '#42a5f5' }} />
      }]
    : [];

  const chucNangNhom = [
    {
      title: 'QUẢN LÝ DỮ LIỆU',
      icon: <StorageIcon />,
      items: [
        {
          label: 'CHỐT SỐ LIỆU',
          code: 'CHOT',
          color: '#42a5f5',
          icon: <LockIcon sx={{ fontSize: 50, color: '#42a5f5' }} />
        },
        {
          label: 'SỐ LIỆU TRONG NGÀY',
          code: 'SONGAY',
          color: '#66bb6a',
          icon: <CalendarTodayIcon sx={{ fontSize: 50, color: '#66bb6a' }} />
        },
        {
          label: 'ĐIỀU CHỈNH SUẤT ĂN',
          code: 'SUATAN',
          color: '#ffb300',
          icon: <PlaylistAddCheckIcon sx={{ fontSize: 50, color: '#ffb300' }} /> // ✅ Đã thay đổi icon
        },
        {
          label: 'XÓA DỮ LIỆU',
          code: 'XOANGAY',
          color: '#ef5350',
          icon: <DeleteOutlineIcon sx={{ fontSize: 50, color: '#ef5350' }} />
        },
        ...quanTriHeThong,
      ],
    },
    {
      title: 'THỐNG KÊ DỮ LIỆU',
      icon: <BarChartIcon />,
      items: [
        {
          label: 'THỐNG KÊ THEO NGÀY',
          code: 'TKNGAY',
          color: '#ab47bc',
          icon: <BarChartIcon sx={{ fontSize: 50, color: '#ab47bc' }} />
        },
        {
          label: 'CHI TIẾT TỪNG THÁNG',
          code: 'TKTHANG',
          color: '#26c6da',
          icon: <QueryStatsIcon sx={{ fontSize: 50, color: '#26c6da' }} />
        },
        {
          label: 'TỔNG HỢP CẢ NĂM',
          code: 'TKNAM',
          color: '#8d6e63',
          icon: <TimelineIcon sx={{ fontSize: 50, color: '#8d6e63' }} />
        },
        ...quanTriHeThong,
      ],
    },
    {
      title: 'DANH SÁCH HỌC SINH',
      icon: <ManageAccountsIcon />,
      items: [
        {
          label: 'CẬP NHẬT DANH SÁCH',
          code: 'CAPNHAT',
          color: '#5c6bc0',
          icon: <ManageAccountsIcon sx={{ fontSize: 50, color: '#5c6bc0' }} />
        },
        {
          label: 'LẬP DANH SÁCH LỚP',
          code: 'LAPDS',
          color: '#ec407a',
          icon: <FormatListBulletedIcon sx={{ fontSize: 50, color: '#ec407a' }} />
        },
        {
          label: 'TẢI DANH SÁCH LÊN',
          code: 'TAIDS',
          color: '#789262',
          icon: <FileUploadIcon sx={{ fontSize: 50, color: '#789262' }} />
        },
        ...quanTriHeThong,
      ],
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #e3f2fd, #bbdefb)' }}>
      <Banner title="HỆ THỐNG QUẢN LÝ" />
      <Box sx={{ px: 2, pt: 3, pb: 6 }}>
        {selectedFunction ? (
          <Box maxWidth={700} mx="auto">{renderSelectedFunction()}</Box>
        ) : (
          <Box maxWidth="lg" mx="auto">
            <Tabs
              value={tabIndex}
              onChange={(e, newIndex) => setTabIndex(newIndex)}
              variant="fullWidth"
              textColor="primary"
              indicatorColor="primary"
              sx={{
                mb: 3,
                '& .MuiTab-root': {
                  fontWeight: 600,
                  fontSize: 15,
                  minHeight: 42,
                },
              }}
            >
              {chucNangNhom.map((nhom, index) => (
                <Tab
                  key={index}
                  label={nhom.title}
                  icon={nhom.icon}
                  iconPosition="start"
                />
              ))}
            </Tabs>

            <Grid container spacing={3} justifyContent="center">
              {chucNangNhom[tabIndex].items.map((item) => (
                <Grid item key={item.code}>
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card
                      elevation={4}
                      sx={{
                        borderRadius: 2,
                        height: 250,
                        width: 210,
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        px: 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          pt: 2,
                        }}
                        onClick={() => handleFunctionSelect(item.code)}
                      >
                        <Box
                          sx={{
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            backgroundColor: `${item.color}22`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {item.icon}
                        </Box>
                      </Box>
                      <CardContent sx={{ py: 1.5, flexGrow: 1 }}>
                        <Typography
                          variant="subtitle1"
                          fontWeight={600}
                          gutterBottom
                          noWrap
                          sx={{ color: '#1976d2', mt: 1 }} // ✅ thêm margin-top
                        >
                          {item.label}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                          noWrap
                        >
                          Nhấn để truy cập
                        </Typography>
                      </CardContent>
                      <Box sx={{ px: 2, pb: 2 }}>
                        <Button
                          variant="contained"
                          fullWidth
                          sx={{
                            backgroundColor: item.color,
                            fontWeight: 600,
                            py: 1,
                            fontSize: '0.85rem',
                            '&:hover': {
                              backgroundColor: item.color,
                              filter: 'brightness(0.9)',
                            },
                          }}
                          onClick={() => handleFunctionSelect(item.code)}
                        >
                          Vào
                        </Button>
                      </Box>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Box>
    </Box>
  );
}
