import React, { useState, useEffect } from 'react';
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
  Button,
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Checkbox,
  Card,
} from '@mui/material';

const rawStudentData = `NGUYỄN NGỌC THẢO\t5.1
NGUYỄN NGỌC BẢO NGÂN\t5.1
NGUYỄN PHAN NGỌC KHÁNH\t5.1
HỒ NGUYỄN TRUNG HẬU\t5.1
NGUYỄN LÊ THIÊN ANH\t5.1
TRẦN NGỌC QUỲNH TRÂM\t5.1
TRẦN VĂN KHOA\t5.1
TRƯƠNG THIỆN PHÚC\t5.1
LÊ NGỌC THIÊN HƯƠNG\t5.1
BÙI MINH HUY\t5.1
TRẦN THỊ BẢO NGỌC\t5.1
VÕ TRÍ ĐẠT\t5.2
PHAN NGUYỄN GIA LINH\t5.2
NGUYỄN TƯỜNG LAM\t5.2
NGUYỄN NGỌC GIA LINH\t5.2
DƯƠNG HOÀNG ANH\t5.2
NGUYỄN LÊ KHANG\t5.2
BÙI NGUYỄN HỮU TRÍ\t5.2
VÕ HỮU NHÂN\t5.2
PHẠM HOÀNG BẢO NGHI\t5.3
TRẦN HUỲNH KIM XUÂN\t5.3
NGUYỄN NGỌC THỦY TIÊN\t5.3
ĐẶNG HUỲNH GIA BẢO\t5.3
NGÔ MINH THÔNG\t5.3
TRẦN MINH NHẬT\t5.3
NGUYỄN HỒ KIM PHƯỢNG\t5.3
NGUYỄN HUỲNH GIAO\t5.4
ĐÀO THỊ THẢO VY\t5.4
HUỲNH NG. PHƯƠNG NGHI\t5.4
HUỲNH NGỌC YẾN LINH\t5.4
VÕ LÊ TRÚC HÀ\t5.4
PHAN TRẤN PHONG\t5.4
BÙI ANH TUẤN\t5.5
TẠ ĐĂNG KHÔI\t5.5
TRẦN GIA BẢO\t5.5
BÙI NGUYỄN TẤN LỢI\t5.5
TRƯƠNG ĐĂNG KHOA\t5.5
LÊ TRƯỜNG PHÚC\t5.5`;

const students = rawStudentData.split('\n').map((line, index) => {
  const [name, className] = line.split('\t');
  return { id: index + 1, name, className, registered: false };
});

const classList = [...new Set(students.map(s => s.className))];

export default function Lop5() {
  const [selectedClass, setSelectedClass] = useState(classList[0] || '');
  const [filteredStudents, setFilteredStudents] = useState([]);

  useEffect(() => {
    if (selectedClass) {
      setFilteredStudents(students.filter(s => s.className === selectedClass));
    }
  }, [selectedClass]);

  const handleClassChange = (event) => {
    setSelectedClass(event.target.value);
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
    <Box
      sx={{
        minHeight: '100vh',
        //bgcolor: 'linear-gradient(to bottom, #e3f2fd, #bbdefb)',
        background: 'linear-gradient(to bottom, #e3f2fd, #bbdefb)', // đúng cú pháp
        py: 6,
        px: 2,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Card
        sx={{
          p: 4,
          maxWidth: 450,
          width: '100%',
          borderRadius: 4,
          boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
          backgroundColor: 'white',
        }}
        elevation={10}
      >
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          fontWeight="bold"
          color="primary"
          sx={{
            mb: 4,
            textShadow: '2px 2px 5px rgba(0,0,0,0.1)',
            borderBottom: '3px solid #1976d2',
            pb: 1,
          }}
        >
          DANH SÁCH HỌC SINH
        </Typography>

        <Stack direction="row" justifyContent="center" sx={{ mb: 4 }}>
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
          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: 'white' }}>STT</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: 'white' }}>HỌ VÀ TÊN</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: 'white' }}>ĐĂNG KÝ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredStudents.map((student, index) => (
                  <TableRow key={index} hover>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell align="center">
                      <Checkbox
                        checked={student.registered}
                        onChange={() => toggleRegister(index)}
                        size="small"
                        color="primary"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {selectedClass && (
          <Stack direction="row" justifyContent="center" sx={{ mt: 4 }}>
            <Button
              variant="contained"
              onClick={handleSave}
              sx={{ minWidth: 160, fontWeight: 600, py: 1 }}
            >
              Lưu đăng ký
            </Button>
          </Stack>
        )}
      </Card>
    </Box>
  );
}
