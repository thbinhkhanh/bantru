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

const rawStudentData = `NGUYỄN THIÊN ĐỨC	3.1
NGUYỄN THANH PHÚC	3.1
TRẦN HÀ ANH	3.1
TRẦN AN KHUÊ	3.1
NG HUỲNH PHƯƠNG NGHI	3.1
LÊ MINH NHẬT VY	3.1
NGUYỄN HOÀNG PHÚC NGUYÊN	3.2
NGUYỄN MINH KHUÊ	3.2
TRẦN NGỌC ĐỨC	3.2
THÁI THIÊN BẢO	3.2
NGUYỄN TẤN HƯNG	3.2
TRẦN NGỌC THIÊN DI	3.2
TRẦN THỊ AN BÌNH	3.2
VÕ HUỲNH PHƯƠNG UYÊN	3.2
BÙI MINH THUẬN	3.2
NGUYỄN CHÍ CÔNG	3.2
HUỲNH NHẬT TRÍ	3.2
NGUYỄN HOÀNG GIA BẢO	3.3
NGUYỄN BẢO KHƯƠNG	3.3
NGUYỄN BẢO NGUYÊN	3.3
NGUYỄN THIÊN NHÂN	3.3
LÊ THIÊN PHÚC	3.3
TRẦN VÕ KHẢ NHI	3.3
TRẦN HOÀNG AN NHIÊN	3.3
HUỲNH LÊ NHÃ VY	3.3
NGUYỄN HUỲNH LAN VY	3.3
TRẦN GIA CÁT	3.3
ĐÀO NGỌC QUANG	3.4
TRẦN NGỌC TƯỜNG LAM	3.4
NGUYỄN NGỌC NHƯ Ý	3.4
NGÔ NGUYỄN NGỌC GIA	3.4
TRẦN MINH ĐẠT	3.5
PHAN TRỌNG NGHĨA	3.5
NGUYỄN PHẠM HẢI ĐĂNG	3.5
NGUYỄN TRẦN KHÁNH AN	3.5
TRẦN NGỌC BẢO YẾN	3.5
CAO CHÍ THIỆN	3.6
TRẦN THANH TUẤN	3.6
NGUYỄN HOÀNG THIỆN	3.6
LÊ THỊ KIM PHỤNG	3.6
TRƯƠNG HUỲNH BẢO THY	3.6
ĐÀO THỊ NHÃ THY	3.6
LÊ THỊ PHƯƠNG LINH	3.6
VÕ THỊ THANH NGUYỆT	3.6
NGUYỄN NGỌC MINH HẰNG	3.6
ĐẬU ĐỨC THẮNG	3.6`;

const students = rawStudentData.split('\n').map((line, index) => {
  const [name, className] = line.split('\t');
  return { id: index + 1, name, className, registered: false };
});

const classList = [...new Set(students.map(s => s.className))];

export default function Lop3() {
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