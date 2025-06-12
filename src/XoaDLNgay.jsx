import React, { useState } from 'react';
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

const classList = [
  '1.1', '1.2', '1.3', '1.4', '1.5', '1.6',
  '2.1', '2.2', '2.3', '2.4', '2.5', '2.6',
  '3.1', '3.2', '3.3', '3.4', '3.5', '3.6',
  '4.1', '4.2', '4.3', '4.4', '4.5', '4.6',
  '5.1', '5.2', '5.3', '5.4', '5.5'
];

export default function ChotSoLieu() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [option, setOption] = useState('toantruong');
  const [selectedClass, setSelectedClass] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [progressing, setProgressing] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [resultMessage, setResultMessage] = useState('');

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
    }, 1500); // Giả lập tiến trình xóa
  };

  return (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 'calc(100vh - 64px)',
      backgroundColor: '#f5f5f5',
      p: 2,
    }}
  >
    <Paper elevation={3} sx={{ p: 4, borderRadius: 4, maxWidth: 500, width: '100%' }}>
      <Typography
        variant="h5"
        align="center"
        gutterBottom
        fontWeight="bold"
        color="primary"
        sx={{ mb: 4 }}
      >
        XÓA DỮ LIỆU THEO NGÀY
      </Typography>

      <Stack spacing={3} alignItems="center">
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
          <DatePicker
            label="Chọn ngày"
            value={selectedDate}
            onChange={(newValue) => {
              setSelectedDate(newValue);
              setShowSuccess(false);
            }}
            renderInput={(params) => <TextField {...params} size="small" />}
          />
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
