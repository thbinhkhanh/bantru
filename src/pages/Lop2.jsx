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

const rawStudentData = `ĐẶNG BẢO DUY	2.1
ĐỖ NGUYỄN THIÊN HƯƠNG	2.1
LÂM THÀNH ĐƯỢC	2.1
LÂM TUẤN ANH	2.1
NGUYỄN CHÍ LIÊM	2.1
NGUYỄN GIA KHÁNH	2.1
NGUYỄN KHÁNH NGỌC	2.1
NGUYỄN QUỐC NGUYÊN	2.1
PHẠM KHÁNH AN	2.1
PHẠM TRẦN BẢO TRÂN	2.1
TRẦN HÀ GIANG	2.1
VÕ UYÊN NHƯ	2.1
BÙI MINH CƯỜNG	2.2
BÙI THANH PHONG	2.2
CHÂU NHÃ ÁI	2.2
LÔ TRẦN THẢO NHI	2.2
NGÔ THIÊN LẠC	2.2
NGUYỄN NGỌC KHÁNH AN	2.2
PHẠM HẢI ĐĂNG	2.2
PHAN MAI HƯƠNG	2.2
TẠ QUỲNH NHƯ	2.2
TRẦN HỒ MINH ANH	2.2
TRẦN KHÁNH LINH	2.2
TRẦN NHÃ CÁT TƯỜNG	2.2
BÙI PHÚC  AN	2.3
DƯƠNG NGUYỄN BÍCH TUYỀN	2.3
LÊ HỒ TỐ UYÊN	2.3
NGUYỄN THỊ QUYẾT TÂM	2.3
PHẠM HOÀNG LONG	2.3
PHAN TUỆ NGHI	2.3
LÊ THỊ HƯƠNG QUỲNH	2.4
NGUYỄN ĐĂNG KHÔI	2.4
NGUYỄN VĂN NGUYỄN	2.4
VÕ TRƯỜNG THẠCH	2.4
HUỲNH TUỆ NHƯ	2.5
LƯƠNG THANH TRỌNG	2.5
NGÔ PHẠM MINH TIẾN	2.5
CHÂU HOÀNG ĐÌNH BẢO	2.6
CHÂU MINH HOÀI	2.6
HUỲNH NGUYỄN NGỌC UYÊN	2.6
PHẠM NGỌC LAN	2.6`;

const students = rawStudentData.split('\n').map((line, index) => {
  const [name, className] = line.split('\t');
  return { id: index + 1, name, className, registered: false };
});

const classList = [...new Set(students.map(s => s.className))];

export default function Lop2() {
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
          boxShadow: '0 8px 30px rgba(148, 12, 12, 0.15)',
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
