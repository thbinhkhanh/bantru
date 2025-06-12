import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  LinearProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export default function LapDanhSach() {
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    setSuccess(false);
    setError(false);
    setErrorMsg('');

    if (!file) return;

    if (!file.name.endsWith('.xlsx')) {
      setErrorMsg('Vui lòng chọn file Excel (.xlsx)');
      setError(true);
      e.target.value = null; // reset input
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB
      setErrorMsg('File quá lớn (tối đa 10MB)');
      setError(true);
      e.target.value = null;
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result.split(',')[1]; // Bỏ phần data:...
      const fileName = file.name;
      setUploading(true);

      try {
        const response = await fetch(
          'https://script.google.com/macros/s/AKfycbx-SCgW73YUrwvOmHAb9Gdo8W93VWSPzqNsf5AeJZsHnfUebHcwSHY5asjRrHoWhxuscw/exec',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              fileName,
              base64Data: base64,
            }),
          }
        );

        const result = await response.json();
        if (result.success) {
          setSuccess(true);
        } else {
          setErrorMsg(result.error || 'Lỗi không xác định từ máy chủ!');
          setError(true);
        }
      } catch (err) {
        setErrorMsg(err.message || 'Lỗi kết nối máy chủ!');
        setError(true);
      } finally {
        setUploading(false);
        e.target.value = null; // reset input
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4, p: 3 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
        <Typography
          variant="h5"
          align="center"
          fontWeight="bold"
          color="primary"
          gutterBottom
        >
          TẢI DANH SÁCH BÁN TRÚ
          <Box
            sx={{
              height: '2px',
              width: '100%',
              backgroundColor: '#1976d2',
              borderRadius: 1,
              mt: 1,
              mb: 2,
            }}
          />
        </Typography>

        <Stack spacing={3} alignItems="center">
          <Button
            variant="contained"
            component="label"
            startIcon={<CloudUploadIcon />}
            disabled={uploading}
            sx={{ minWidth: 220 }}
          >
            Chọn file Excel
            <input
              type="file"
              hidden
              accept=".xlsx"
              onChange={handleFileUpload}
            />
          </Button>

          {uploading && (
            <Box sx={{ width: '60%' }}>
              <LinearProgress />
              <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                Đang tải và xử lý dữ liệu...
              </Typography>
            </Box>
          )}
        </Stack>

        <Snackbar
          open={success}
          autoHideDuration={4000}
          onClose={() => setSuccess(false)}
        >
          <Alert
            severity="success"
            variant="filled"
            iconMapping={{ success: <CloudUploadIcon /> }}
          >
            Cập nhật thành công! 🎉
          </Alert>
        </Snackbar>

        <Snackbar
          open={error}
          autoHideDuration={5000}
          onClose={() => setError(false)}
        >
          <Alert severity="error" variant="filled">
            {errorMsg}
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
}
