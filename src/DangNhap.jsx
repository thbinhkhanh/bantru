import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

import {
  Box, Card, Stack, Typography, TextField, Button, Alert,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';

import Banner from './pages/Banner';

export default function DangNhap() {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('user');
  const [savedUserPassword, setSavedUserPassword] = useState('@bc');
  const [savedAdminPassword, setSavedAdminPassword] = useState('123');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPasswords = async () => {
      try {
        const adminSnap = await getDoc(doc(db, 'SETTINGS', 'ADMIN'));
        const userSnap = await getDoc(doc(db, 'SETTINGS', 'USER'));
        if (adminSnap.exists()) setSavedAdminPassword(adminSnap.data().password || '123');
        if (userSnap.exists()) setSavedUserPassword(userSnap.data().password || '@bc');
      } catch (err) {
        console.error('❌ Lỗi khi lấy mật khẩu:', err);
      }
    };
    fetchPasswords();
  }, []);

  const handleLogin = () => {
    const expectedPassword = selectedAccount === 'user' ? savedUserPassword : savedAdminPassword;
    if (password === expectedPassword) {
      if (selectedAccount === 'user') {
        navigate('/quanly');
      } else {
        navigate('/admin');
      }
    } else {
      setMessage('❌ Mật khẩu không chính xác!');
    }
  };

  // Tiêu đề tùy theo lựa chọn tài khoản
  const bannerTitle = selectedAccount === 'user' ? 'QUẢN LÝ BÁN TRÚ' : 'QUẢN TRỊ HỆ THỐNG';

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #e3f2fd, #bbdefb)' }}>
      <Banner title="ĐĂNG NHẬP QUẢN LÝ" />
      <Box
        sx={{
          width: { xs: '95%', sm: 400 },
          mx: 'auto',
          mt: 3,
        }}
      >

        <Card elevation={10} sx={{ p: 4, borderRadius: 3, backgroundColor: '#ffffff' }}>
          <Stack spacing={3}>
            <Box textAlign="center">
              <Box sx={{ fontSize: 48, color: 'primary.main', mb: 1 }}>
                🔐
              </Box>
              <Typography
                variant="h5"
                fontWeight="bold"
                color="primary"
                sx={{ mb: 2 }} // 👉 thêm khoảng cách bên dưới tiêu đề
              >
                {bannerTitle}
              </Typography>
            </Box>

            <FormControl fullWidth variant="outlined">
              <InputLabel id="account-label">Loại tài khoản</InputLabel>
              <Select
                labelId="account-label"
                label="Loại tài khoản" // 👈 rất quan trọng để "chừa chỗ" cho nhãn
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
              >
                <MenuItem value="user">👤 User</MenuItem>
                <MenuItem value="admin">🔐 Admin</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="🔒 Mật khẩu"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {message && <Alert severity="error" variant="filled">{message}</Alert>}

            <Button
              variant="contained"
              fullWidth
              onClick={handleLogin}
              sx={{ height: 40, fontWeight: 'bold', fontSize: '16px' }}
            >
              🔓 Đăng nhập
            </Button>
          </Stack>
        </Card>
      </Box>
    </Box>
  );
}
