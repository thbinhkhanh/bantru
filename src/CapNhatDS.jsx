import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  TextField,
  Button,
  LinearProgress,
  Snackbar,
  Alert,
  FormControlLabel,
  Switch,
} from '@mui/material';

const classOptions = ['5.1', '5.2', '5.3', '5.4', '5.5'];
const statusOptions = ['Đăng ký lại', 'Hủy đăng ký', 'Đăng ký mới'];

const demoStudents = [
  { id: '7952245907', name: 'HỒ NGUYỄN TRUNG HẬU', class: '5.1' },
  { id: '7926588441', name: 'TRẦN VĂN KHOA', class: '5.1' },
  { id: '7926588356', name: 'TRƯƠNG THIỆN PHÚC', class: '5.1' },
  { id: '7926588263', name: 'BÙI MINH HUY', class: '5.1' },
  { id: '7952245902', name: 'NGUYỄN LÊ THIÊN ANH', class: '5.1' },
  { id: '7952245915', name: 'NGUYỄN NGỌC BẢO NGÂN', class: '5.1' },
  { id: '7952245909', name: 'NGUYỄN PHAN NGỌC KHÁNH', class: '5.1' },
  { id: '4052245916', name: 'TRẦN THỊ BẢO NGỌC', class: '5.1' },
  { id: '7976160671', name: 'NGUYỄN NGỌC THẢO', class: '5.1' },
  { id: '7926588270', name: 'LÊ NGỌC THIÊN HƯƠNG', class: '5.1' },
  { id: '7926588452', name: 'TRẦN NGỌC QUỲNH TRÂM', class: '5.1' },
  { id: '79214042646', name: 'DƯƠNG HOÀNG ANH', class: '5.2' },
  { id: '86214010567', name: 'VÕ TRÍ ĐẠT', class: '5.2' },
  { id: '79214018933', name: 'BÙI NGUYỄN HỮU TRÍ', class: '5.2' },
  { id: '79214018037', name: 'VÕ HỮU NHÂN', class: '5.2' },
  { id: '79214025944', name: 'NGUYỄN LÊ KHANG', class: '5.2' },
  { id: '79314043124', name: 'NGUYỄN TƯỜNG LAM', class: '5.2' },
  { id: '79314043195', name: 'PHAN NGUYỄN GIA LINH', class: '5.2' },
  { id: '79314017578', name: 'NGUYỄN NGỌC GIA LINH', class: '5.2' },
  { id: '7952264390', name: 'ĐẶNG HUỲNH GIA BẢO', class: '5.3' },
  { id: '7926588415', name: 'TRẦN MINH NHẬT', class: '5.3' },
  { id: '7942211205', name: 'NGÔ MINH THÔNG', class: '5.3' },
  { id: '7959197625', name: 'PHẠM HOÀNG BẢO NGHI', class: '5.3' },
  { id: '7926588239', name: 'NGUYỄN HỒ KIM PHƯỢNG', class: '5.3' },
  { id: '7952264405', name: 'NGUYỄN NGỌC THỦY TIÊN', class: '5.3' },
  { id: '7952264409', name: 'TRẦN HUỲNH KIM XUÂN', class: '5.3' },
  { id: '7942211304', name: 'PHAN TRẤN PHONG', class: '5.4' },
  { id: '9685589118', name: 'NGUYỄN HUỲNH GIAO', class: '5.4' },
  { id: '7952250847', name: 'HUỲNH NG. PHƯƠNG NGHI', class: '5.4' },
  { id: '7952250858', name: 'ĐÀO THỊ THẢO VY', class: '5.4' },
  { id: '7952250842', name: 'HUỲNH NGỌC YẾN LINH', class: '5.4' },
  { id: '7952250833', name: 'VÕ LÊ TRÚC HÀ', class: '5.4' },
  { id: '7951520796', name: 'TRẦN GIA BẢO', class: '5.5' },
  { id: '7952257443', name: 'TẠ ĐĂNG KHÔI', class: '5.5' },
  { id: '7926588297', name: 'TRƯƠNG ĐĂNG KHOA', class: '5.5' },
  { id: '7950168309', name: 'BÙI NGUYỄN TẤN LỢI', class: '5.5' },
  { id: '4677529501', name: 'LÊ TRƯỜNG PHÚC', class: '5.5' },
  { id: '7952257471', name: 'BÙI ANH TUẤN', class: '5.5' },
];

export default function DangKyLaiBanTru() {
  const [students, setStudents] = useState(
    Array(10).fill(null).map((_, index) => ({
      stt: index + 1,
      id: '',
      name: '',
      lop: '',
      dangKy: '',
    }))
  );
  const [loading, setLoading] = useState(false);
  const [enableSelect, setEnableSelect] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('warning');

  const handleChange = (index, field, value) => {
    const updated = [...students];
    updated[index][field] = value;

    if (field === 'lop') {
      updated[index].name = '';
      updated[index].id = '';
    }

    if (field === 'name') {
      const studentInfo = demoStudents.find((s) => s.name === value);
      updated[index].id = studentInfo?.id || '';
    }

    setStudents(updated);
  };

  const handleCapNhat = () => {
    const filledRows = students.filter(
      (s) => s.name.trim() || s.lop.trim() || s.dangKy.trim()
    );

    if (filledRows.length === 0) {
      setSnackbarMessage('Cảnh báo:\nKhông có dữ liệu nào để cập nhật.');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }

    let errorMessage = '';
    filledRows.forEach((student, index) => {
      const dong = students.findIndex((s) => s === student) + 1;
      if (!student.name.trim()) errorMessage += `Dòng ${dong} chưa chọn họ và tên\n`;
      if (!student.lop.trim()) errorMessage += `Dòng ${dong} chưa chọn lớp\n`;
      if (!student.dangKy.trim()) errorMessage += `Dòng ${dong} chưa chọn trạng thái đăng ký\n`;
    });

    if (errorMessage) {
      setSnackbarMessage(`Cảnh báo:\n${errorMessage.trim()}`);
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSnackbarMessage('Cập nhật thành công!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    }, 2000);
  };

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', mt: 4, p: 2 }}>
  <Paper elevation={3} sx={{ p: 3, borderRadius: 4 }}>
    <Typography
      variant="h5"
      align="center"
      fontWeight="bold"
      color="primary"
      sx={{ mt: 2 }}
    >
      CẬP NHẬT DANH SÁCH BÁN TRÚ
    </Typography>

    <Box mb={2} display="flex" justifyContent="center">
      <FormControlLabel
        control={
          <Switch
            checked={enableSelect}
            onChange={(e) => setEnableSelect(e.target.checked)}
          />
        }
        label="Chọn học sinh từ danh sách (bật/tắt)"
      />
    </Box>

    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: '#e3f2fd' }}>
            <TableCell align="center" sx={{ px: 1, py: 0.5 }}>
              <strong>STT</strong>
            </TableCell>
            <TableCell align="center" sx={{ px: 1, py: 0.5 }}>
              <strong>MÃ ĐỊNH DANH</strong>
            </TableCell>
            <TableCell align="center" sx={{ px: 1, py: 0.5 }}>
              <strong>HỌ VÀ TÊN</strong>
            </TableCell>
            <TableCell align="center" sx={{ px: 1, py: 0.5 }}>
              <strong>LỚP</strong>
            </TableCell>
            <TableCell align="center" sx={{ px: 1, py: 0.5 }}>
              <strong>ĐĂNG KÝ</strong>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {students.map((student, index) => {
            const filteredStudents = demoStudents.filter((s) => s.class === student.lop);
            return (
              <TableRow key={index}>
                <TableCell align="center" sx={{ width: 80, minWidth: 60, px: 1, py: 0.5 }}>
                  <TextField
                    value={student.stt}
                    size="small"
                    fullWidth
                    inputProps={{ style: { textAlign: 'center' }, readOnly: true }}
                  />
                </TableCell>

                <TableCell align="center" sx={{ width: 140, minWidth: 100, px: 1, py: 0.5 }}>
                  <TextField
                    value={student.id}
                    onChange={(e) => handleChange(index, 'id', e.target.value)}
                    size="small"
                    fullWidth
                    inputProps={{
                      style: { textAlign: 'center' },
                      readOnly: enableSelect,
                    }}
                  />
                </TableCell>

                <TableCell align="center" sx={{ px: 1, py: 0.5 }}>
                  {enableSelect ? (
                    <FormControl fullWidth size="small" disabled={!student.lop}>
                      <Select
                        value={student.name}
                        onChange={(e) => handleChange(index, 'name', e.target.value)}
                        displayEmpty
                        sx={{ textAlign: 'left' }}
                      >
                        <MenuItem value="">
                          <em>Chọn tên</em>
                        </MenuItem>
                        {filteredStudents.map((s) => (
                          <MenuItem key={s.id} value={s.name}>
                            {s.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ) : (
                    <TextField
                      value={student.name}
                      onChange={(e) => handleChange(index, 'name', e.target.value)}
                      size="small"
                      fullWidth
                    />
                  )}
                </TableCell>

                <TableCell align="center" sx={{ px: 1, py: 0.5 }}>
                  <FormControl fullWidth size="small">
                    <Select
                      value={student.lop}
                      onChange={(e) => handleChange(index, 'lop', e.target.value)}
                      displayEmpty
                    >
                      <MenuItem value="">
                        <em>Chọn lớp</em>
                      </MenuItem>
                      {classOptions.map((cls) => (
                        <MenuItem key={cls} value={cls}>
                          {cls}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>

                <TableCell align="center" sx={{ px: 1, py: 0.5 }}>
                  <FormControl fullWidth size="small">
                    <Select
                      value={student.dangKy}
                      onChange={(e) => handleChange(index, 'dangKy', e.target.value)}
                      displayEmpty
                    >
                      <MenuItem value="">
                        <em>Chọn trạng thái</em>
                      </MenuItem>
                      {statusOptions.map((status) => (
                        <MenuItem key={status} value={status}>
                          {status}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>

    <Box mt={3} display="flex" flexDirection="column" alignItems="center">
      <Button variant="contained" color="primary" onClick={handleCapNhat}>
        Cập nhật
      </Button>
      {loading && (
        <Box sx={{ width: '100%', mt: 2 }}>
          <LinearProgress />
        </Box>
      )}
    </Box>
  </Paper>

  <Snackbar
    open={snackbarOpen}
    autoHideDuration={4000}
    onClose={() => setSnackbarOpen(false)}
    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
  >
    <Alert
      onClose={() => setSnackbarOpen(false)}
      severity={snackbarSeverity}
      variant="filled"
      sx={{ width: '100%' }}
    >
      {snackbarMessage}
    </Alert>
  </Snackbar>
</Box>
  );
}
