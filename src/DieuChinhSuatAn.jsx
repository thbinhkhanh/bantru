import React, { useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Checkbox,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import vi from 'date-fns/locale/vi';

const rawStudentData = `HỌ NGUYỄN TRUNG HẬU	5.1
TRẦN VĂN KHOA	5.1
TRƯƠNG THIỆN PHÚC	5.1
BÙI MINH HUY	5.1
NGUYỄN LÊ THIÊN ANH	5.1
NGUYỄN NGỌC BẢO NGÂN	5.1
NGUYỄN PHAN NGỌC KHÁNH	5.1
TRẦN THỊ BẢO NGỌC	5.1
NGUYỄN NGỌC THẢO	5.1
LÊ NGỌC THIÊN HƯƠNG	5.1
TRẦN NGỌC QUỲNH TRÂM	5.1
DƯƠNG HOÀNG ANH	5.2
VÕ TRÍ ĐẠT	5.2
BÙI NGUYỄN HỮU TRÍ	5.2
VÕ HỮU NHÂN	5.2
NGUYỄN LÊ KHANG	5.2
NGUYỄN TƯỜNG LAM	5.2
PHAN NGUYỄN GIA LINH	5.2
NGUYỄN NGỌC GIA LINH	5.2
ĐẶNG HUỲNH GIA BẢO	5.3
TRẦN MINH NHẬT	5.3
NGÔ MINH THÔNG	5.3
PHẠM HOÀNG BẢO NGHI	5.3
NGUYỄN HỒ KIM PHƯỢNG	5.3
NGUYỄN NGỌC THỦY TIÊN	5.3
TRẦN HUỲNH KIM XUÂN	5.3
PHAN TRẤN PHONG	5.4
NGUYỄN HUỲNH GIAO	5.4
HUỲNH NG. PHƯƠNG NGHI	5.4
ĐÀO THỊ THẢO VY	5.4
HUỲNH NGỌC YẾN LINH	5.4
VÕ LÊ TRÚC HÀ	5.4
TRẦN GIA BẢO	5.5
TẠ ĐĂNG KHÔI	5.5
TRƯƠNG ĐĂNG KHOA	5.5
BÙI NGUYỄN TẤN LỢI	5.5
LÊ TRƯỜNG PHÚC	5.5
BÙI ANH TUẤN	5.5`;

const students = rawStudentData.split('\n').map((line, index) => {
  const [name, className] = line.split('\t');
  return { id: index + 1, name, className, registered: false };
});

const classList = [...new Set(students.map(s => s.className))];

export default function DieuChinhSuatAn() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedClass, setSelectedClass] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);

  const handleClassChange = (event) => {
    const classValue = event.target.value;
    setSelectedClass(classValue);
    setFilteredStudents(students.filter(s => s.className === classValue));
  };

  const toggleRegister = (index) => {
    const updated = [...filteredStudents];
    updated[index].registered = !updated[index].registered;
    setFilteredStudents(updated);
  };

  const handleSave = () => {
    console.log('Dữ liệu lưu:', filteredStudents);
    alert('Đã lưu dữ liệu đăng ký!');
  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4, p: 3 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Typography
            variant="h5"
            fontWeight="bold"
            color="primary"
            gutterBottom
          >
            ĐIỀU CHỈNH SUẤT ĂN
          </Typography>
          <Box sx={{ height: '2px', width: '100%', backgroundColor: '#1976d2', borderRadius: 1 }} />
        </Box>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="center" sx={{ mb: 3 }}>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
            <DatePicker
              label="Chọn ngày"
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              renderInput={(params) => <TextField {...params} size="small" />}
            />
          </LocalizationProvider>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Lớp</InputLabel>
            <Select value={selectedClass} label="Lớp" onChange={handleClassChange}>
              {classList.map((cls, idx) => (
                <MenuItem key={idx} value={cls}>{cls}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        {selectedClass && (
          <TableContainer component={Paper} sx={{ borderRadius: 2, mt: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>STT</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>HỌ VÀ TÊN</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>ĐĂNG KÝ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredStudents.map((student, index) => (
                  <TableRow key={index}>
                    <TableCell align="center" sx={{ py: 0.5 }}>{index + 1}</TableCell>
                    <TableCell sx={{ py: 0.5 }}>{student.name}</TableCell>
                    <TableCell align="center" sx={{ py: 0.5 }}>
                      <Checkbox
                        checked={student.registered}
                        onChange={() => toggleRegister(index)}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {selectedClass && (
          <Stack direction="row" justifyContent="center" sx={{ mt: 3 }}>
            <Button variant="contained" onClick={handleSave} sx={{ minWidth: 140 }}>Lưu</Button>
          </Stack>
        )}
      </Paper>
    </Box>
  );
}
