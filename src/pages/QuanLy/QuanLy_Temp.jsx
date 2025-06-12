import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  Typography,
  Alert,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  IconButton,
  Divider,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import viLocale from 'date-fns/locale/vi';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const summaryData = [
  { group: '1.1', siSo: 14, anBanTru: 14 },
  { group: '1.2', siSo: 7, anBanTru: 7 },
  { group: '1.3', siSo: 13, anBanTru: 13 },
  { group: '1.4', siSo: 12, anBanTru: 12 },
  { group: '1.5', siSo: 8, anBanTru: 8 },
  { group: '1.6', siSo: 7, anBanTru: 7 },
  { group: 'KHỐI 1', siSo: 61, anBanTru: 61, isGroup: true },

  { group: '2.1', siSo: 11, anBanTru: 11 },
  { group: '2.2', siSo: 12, anBanTru: 12 },
  { group: '2.3', siSo: 6, anBanTru: 6 },
  { group: '2.4', siSo: 4, anBanTru: 4 },
  { group: '2.5', siSo: 3, anBanTru: 3 },
  { group: '2.6', siSo: 4, anBanTru: 4 },
  { group: 'KHỐI 2', siSo: 40, anBanTru: 40, isGroup: true },

  { group: '3.1', siSo: 5, anBanTru: 5 },
  { group: '3.2', siSo: 11, anBanTru: 11 },
  { group: '3.3', siSo: 10, anBanTru: 10 },
  { group: '3.4', siSo: 4, anBanTru: 4 },
  { group: '3.5', siSo: 5, anBanTru: 5 },
  { group: '3.6', siSo: 10, anBanTru: 10 },
  { group: 'KHỐI 3', siSo: 45, anBanTru: 45, isGroup: true },

  { group: '4.1', siSo: 5, anBanTru: 5 },
  { group: '4.2', siSo: 14, anBanTru: 14 },
  { group: '4.3', siSo: 14, anBanTru: 14 },
  { group: '4.4', siSo: 4, anBanTru: 4 },
  { group: '4.5', siSo: 5, anBanTru: 5 },
  { group: '4.6', siSo: 10, anBanTru: 10 },
  { group: 'KHỐI 4', siSo: 52, anBanTru: 52, isGroup: true },

  { group: '5.1', siSo: 10, anBanTru: 10 },
  { group: '5.2', siSo: 8, anBanTru: 8 },
  { group: '5.3', siSo: 7, anBanTru: 7 },
  { group: '5.4', siSo: 6, anBanTru: 6 },
  { group: '5.5', siSo: 6, anBanTru: 6 },
  { group: '5.6', siSo: 0, anBanTru: 0 },
  { group: 'KHỐI 5', siSo: 37, anBanTru: 37, isGroup: true },

  { group: 'TRƯỜNG', siSo: 235, anBanTru: 235, isGroup: true },
];

function Row({ row, openGroups, setOpenGroups }) {
  const isOpen = openGroups.includes(row.group);

  if (row.isGroup) {
    const groupNumber = row.group.split(' ')[1];
    const subRows = summaryData.filter(
      (r) => !r.isGroup && r.group.startsWith(groupNumber + '.')
    );

    const isTruong = row.group === 'TRƯỜNG';

    return (
      <>
        <TableRow
          sx={{
            backgroundColor: isTruong ? '#fff3e0' : '#e3f2fd',
            cursor: isTruong ? 'default' : 'pointer',
            transition: 'background-color 0.25s',
            '&:hover': {
              backgroundColor: isTruong ? '#ffe0b2' : '#bbdefb',
            },
          }}
          onClick={() => {
            if (isTruong) return;
            if (isOpen) {
              setOpenGroups(openGroups.filter((g) => g !== row.group));
            } else {
              setOpenGroups([...openGroups, row.group]);
            }
          }}
        >
          <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', width: '40%' }}>
            {!isTruong && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  if (isOpen) {
                    setOpenGroups(openGroups.filter((g) => g !== row.group));
                  } else {
                    setOpenGroups([...openGroups, row.group]);
                  }
                }}
                aria-label={isOpen ? 'Collapse' : 'Expand'}
              >
                {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            )}
            {row.group}
          </TableCell>
          <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', width: '30%' }}>
            {row.siSo}
          </TableCell>
          <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', width: '30%' }}>
            {row.anBanTru}
          </TableCell>
        </TableRow>

        {isOpen &&
          subRows.map((subRow, idx) => (
            <TableRow
              key={idx}
              sx={{
                backgroundColor: '#f9fbe7',
                '&:hover': { backgroundColor: '#f0f4c3' },
                transition: 'background-color 0.2s',
              }}
            >
              <TableCell sx={{ pl: 6, textAlign: 'center' }}>{subRow.group}</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>{subRow.siSo}</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>{subRow.anBanTru}</TableCell>
            </TableRow>
          ))}
      </>
    );
  }

  return null;
}

export default function App() {
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [password, setPassword] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [message, setMessage] = useState('');
  const [showTable, setShowTable] = useState(false);
  const [openGroups, setOpenGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFinalize, setShowFinalize] = useState(false);

  const handleLogin = () => {
    if (password === '@bc') {
      setLoginSuccess(true);
      setMessage('');
    } else {
      setMessage('Mật khẩu không chính xác!');
    }
  };

  const handleFinalize = () => {
    setShowFinalize(true);
    setMessage('');
    setShowTable(false);
  };

  const handleUpdate = () => {
    if (!selectedDate) {
      setMessage('Vui lòng chọn ngày!');
      setShowTable(false);
      return;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selDate = new Date(selectedDate);
    selDate.setHours(0, 0, 0, 0);

    if (selDate < today) {
      setMessage('Ngày không hợp lệ');
      setShowTable(false);
    } else {
      setLoading(true);
      setMessage('');
      setShowTable(false);

      setTimeout(() => {
        setLoading(false);
        setMessage('Cập nhật dữ liệu thành công!');
        setShowTable(true);
      }, 2000);
    }
  };

  const group1 = ['CHỐT SỐ LIỆU', 'SỐ LIỆU TRONG NGÀY', 'ĐIỀU CHỈNH SUẤT ĂN', 'XÓA DỮ LIỆU THEO NGÀY'];
  const group2 = ['THỐNG KÊ THEO NGÀY', 'CHI TIẾT TỪNG THÁNG', 'TỔNG HỢP CẢ NĂM'];
  const group3 = ['CẬP NHẬT DANH SÁCH', 'LẬP DANH SÁCH BÁN TRÚ', 'TẢI DANH SÁCH LÊN'];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#f4f6f8',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        py: 6,
        px: 2,
        fontFamily: 'Roboto, Arial, sans-serif',
      }}
    >
      {!loginSuccess ? (
        <Card
          sx={{
            p: 4,
            maxWidth: 400,
            width: '100%',
            borderRadius: 3,
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
            backgroundColor: 'white',
          }}
          elevation={8}
        >
          <Typography
            variant="h5"
            component="h1"
            color="primary"
            fontWeight="700"
            gutterBottom
            align="center"
          >
            Đăng nhập quản lý
          </Typography>
          <TextField
            label="Tên đăng nhập"
            variant="outlined"
            fullWidth
            margin="normal"
            value="TH Bình Khánh"
            disabled
            sx={{ input: { fontWeight: '600', color: '#1976d2' } }}
          />
          <TextField
            label="Mật khẩu"
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleLogin();
            }}
          />
          {message && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {message}
            </Alert>
          )}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3, py: 1.5, fontWeight: '600' }}
            onClick={handleLogin}
          >
            Đăng nhập
          </Button>
        </Card>
      ) : (
        <Card
          sx={{
            p: 4,
            maxWidth: 900,
            width: '100%',
            borderRadius: 4,
            boxShadow: '0 12px 20px rgba(0,0,0,0.12)',
            backgroundColor: 'white',
          }}
          elevation={10}
        >
          <Typography variant="h5" color="primary" fontWeight="700" gutterBottom align="center">
            HỆ THỐNG QUẢN LÝ BÁN TRÚ
          </Typography>

          <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 1 }}>
            Chức năng dữ liệu hàng ngày
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
            {group1.map((btn) => (
              <Button
                key={btn}
                variant={btn === 'CHỐT SỐ LIỆU' ? 'contained' : 'outlined'}
                color={btn === 'CHỐT SỐ LIỆU' ? 'secondary' : 'primary'}
                sx={{ fontWeight: '600', py: 1.3 }}
                onClick={btn === 'CHỐT SỐ LIỆU' ? handleFinalize : () => alert(`Chức năng "${btn}" chưa được cài đặt.`)}
              >
                {btn}
              </Button>
            ))}
          </Box>
          <Divider sx={{ mb: 2 }} />

          <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 1 }}>
            Thống kê - Tổng hợp
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
            {group2.map((btn) => (
              <Button
                key={btn}
                variant="outlined"
                color="primary"
                sx={{ fontWeight: '600', py: 1.3 }}
                onClick={() => alert(`Chức năng "${btn}" chưa được cài đặt.`)}
              >
                {btn}
              </Button>
            ))}
          </Box>
          <Divider sx={{ mb: 2 }} />

          <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 1 }}>
            Dữ liệu danh sách học sinh
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
            {group3.map((btn) => (
              <Button
                key={btn}
                variant="outlined"
                color="primary"
                sx={{ fontWeight: '600', py: 1.3 }}
                onClick={() => alert(`Chức năng "${btn}" chưa được cài đặt.`)}
              >
                {btn}
              </Button>
            ))}
          </Box>

          {showFinalize && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                Chọn ngày để cập nhật số liệu
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDateFns} locale={viLocale}>
                <DatePicker
                  label="Chọn ngày"
                  value={selectedDate}
                  onChange={(newValue) => setSelectedDate(newValue)}
                  slotProps={{ textField: { fullWidth: true } }}
                  disablePast
                />
              </LocalizationProvider>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2, fontWeight: '600' }}
                onClick={handleUpdate}
              >
                Cập nhật
              </Button>
              {loading && <LinearProgress sx={{ mt: 2 }} />}
              {message && !loading && (
                <Alert severity={message.includes('không') ? 'error' : 'success'} sx={{ mt: 2 }}>
                  {message}
                </Alert>
              )}
            </Box>
          )}

          {showTable && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                Bảng tổng hợp sĩ số và ăn bán trú
              </Typography>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#eeeeee' }}>
                      <TableCell align="center">Lớp / Khối</TableCell>
                      <TableCell align="center">Sĩ số</TableCell>
                      <TableCell align="center">Ăn bán trú</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {summaryData.map((row, idx) => (
                      <Row
                        key={idx}
                        row={row}
                        openGroups={openGroups}
                        setOpenGroups={setOpenGroups}
                      />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Card>
      )}
    </Box>
  );
}

