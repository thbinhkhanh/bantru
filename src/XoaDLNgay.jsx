import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
  Alert,
  RadioGroup,
  FormControlLabel,
  Radio,
  MenuItem,
  Select,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import vi from 'date-fns/locale/vi';

import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

export default function XoaDLNgay({ onBack }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [option, setOption] = useState('toantruong');
  const [selectedClass, setSelectedClass] = useState('');
  const [classList, setClassList] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [progressing, setProgressing] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [resultMessage, setResultMessage] = useState('');

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'BANTRU'));
        const students = snapshot.docs.map((doc) => doc.data());
        const classes = Array.from(new Set(students.map((s) => s.LỚP))).sort();
        setClassList(classes);
      } catch (error) {
        console.error('Lỗi tải danh sách lớp:', error);
      }
    };

    fetchClasses();
  }, []);

  const formatDate = (date) =>
    date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

  const handleSubmit = () => {
    const dateStr = formatDate(selectedDate);
    const message =
      option === 'toantruong'
        ? `Bạn muốn xóa dữ liệu toàn trường ngày ${dateStr}?`
        : `Bạn muốn xóa dữ liệu lớp ${selectedClass} ngày ${dateStr}?`;

    setConfirmMessage(message);
    setOpenConfirm(true);
  };

  const handleConfirm = () => {
    setOpenConfirm(false);
    setShowSuccess(false);
    setProgressing(true);

    setTimeout(() => {
      setProgressing(false);
      setShowSuccess(true);
      const dateStr = formatDate(selectedDate);
      setResultMessage(
        option === 'toantruong'
          ? `Đã xóa thành công dữ liệu toàn trường ngày ${dateStr}`
          : `Đã xóa thành công dữ liệu lớp ${selectedClass} ngày ${dateStr}`
      );
    }, 1500);
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 0, px: 1 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 4 }}>
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          fontWeight="bold"
          color="primary"
          sx={{ mb: 4 }}
        >
          XÓA DỮ LIỆU
          <Box
            sx={{
              height: '2px',
              width: '100%',
              backgroundColor: '#1976d2',
              borderRadius: 1,
              mt: 1,
              mb: 4,
            }}
          />
        </Typography>

        <Stack spacing={3} alignItems="center">
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
            <Box sx={{ width: 185 }}>
              <DatePicker
                label="Chọn ngày"
                value={selectedDate}
                onChange={(newValue) => {
                  setSelectedDate(newValue);
                  setShowSuccess(false);
                }}
                slotProps={{
                  textField: {
                    size: "small",
                    sx: {
                      minWidth: 130,
                      maxWidth: 185,
                      "& input": {
                        textAlign: "center",
                        height: "1.4375em",
                      },
                    },
                  },
                }}
              />
            </Box>
          </LocalizationProvider>


          <RadioGroup
            row
            value={option}
            onChange={(e) => {
              setOption(e.target.value);
              setShowSuccess(false);
            }}
          >
            <FormControlLabel value="toantruong" control={<Radio />} label="Toàn trường" />
            <FormControlLabel value="chonlop" control={<Radio />} label="Chọn lớp" />
          </RadioGroup>

          {option === 'chonlop' && (
            <Select
              size="small"
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setShowSuccess(false);
              }}
              displayEmpty
              sx={{ minWidth: 140 }}
            >
              <MenuItem value="" disabled>
                -- Chọn lớp --
              </MenuItem>
              {classList.map((cls) => (
                <MenuItem key={cls} value={cls}>
                  {cls}
                </MenuItem>
              ))}
            </Select>
          )}

          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={option === 'chonlop' && !selectedClass}
            sx={{ minWidth: 140 }}
          >
            Thực hiện
          </Button>

          <Button onClick={onBack} color="secondary" fullWidth>
            ⬅️ Quay lại
          </Button>

          {progressing && (
            <Box sx={{ width: '100%', mt: 2 }}>
              <LinearProgress />
            </Box>
          )}

          {showSuccess && (
            <Alert severity="success" sx={{ mt: 2, textAlign: 'center' }}>
              {resultMessage}
            </Alert>
          )}
        </Stack>
      </Paper>

      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <DialogContentText>{confirmMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Hủy</Button>
          <Button onClick={handleConfirm} color="primary" autoFocus>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
