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

const rawStudentData = `NGUYỄN BẢO HUY\t4.1
NGUYỄN HỮU THIỆN\t4.1
NGUYỄN GIA KHOA\t4.1
ĐẶNG SU MY\t4.1
ĐỖ HOÀNG YẾN NGỌC\t4.1
LƯ HOÀNG KHÁNH LINH\t4.1
HOÀNG NGUYỄN BÌNH AN\t4.2
NGUYỄN MINH KHUÊ\t4.2
ĐẶNG PHẠM QUỐC ANH\t4.2
HUỲNH THIỆN NHÂN\t4.2
VÕ NGỌC BẢO CHÂU\t4.2
NGUYỄN PHAN BẢO VY\t4.2
NGUYỄN TRƯƠNG ANH THƯ\t4.2
VÕ HỒNG THẢO NHI\t4.2
NGÔ NGỌC MỘC TRÀ\t4.2
NGUYỄN DUY KHẢ VÂN\t4.2
LÊ GIA KHANH\t4.2
LƯU KHÁNH THY\t4.2
PHẠM LÊ KIỀU DUYÊN\t4.2
VÕ HIẾU NGHĨA\t4.2
ĐẶNG HỒ NHẤT ĐÔ\t4.3
BÙI MINH HOÀNG\t4.3
LÊ PHÚC KHÁNG\t4.3
TRẦN LÊ QUỐC THÁI\t4.3
NGUYỄN TUẤN TÚ\t4.3
BÙI MINH TRIẾT\t4.3
DƯƠNG TẤN VÕ\t4.3
ĐẶNG NGUYỄN NGỌC HÂN\t4.3
HỒ LÊ THỤC QUYÊN\t4.3
NGUYỄN LÊ NHƯ QUỲNH\t4.3
NGUYỄN NGỌC ANH THY\t4.3
HUỲNH KHÁNH VY\t4.3
TRẦN GIA AN\t4.3
NGUYỄN TRẦN THIÊN ÂN\t4.3
ĐẶNG THỤY THANH TRÚC\t4.4
VÕ NGỌC PHƯƠNG UYÊN\t4.4
NGUYỄN LÊ THIÊN KIM\t4.4
PHẠM KHẮC HUY\t4.4
TRẦN TUẤN THIÊN ĐĂNG\t4.5
ĐOÀN NHÃ VY\t4.5
MAI PHẠM ANH THƯ\t4.5
NGUYỄN KIM NGỌC\t4.5
TRẦN HIẾU NGHĨA\t4.5
NGUYỄN ĐỨC THỊNH\t4.6
CHÂU HOÀNG ANH KHOA\t4.6
NGUYỄN TÂN MINH TRÍ\t4.6
BÙI THÀNH ĐẠT\t4.6
DƯƠNG MINH HIẾU\t4.6
LÊ NHẬT HUY\t4.6
PHẠM GIA QUỲNH\t4.6
TRẦN KIM YẾN\t4.6
NGUYỄN MAI PHƯƠNG\t4.6
NGUYỄN THỊ HỒNG VY\t4.6`;

const students = rawStudentData.split('\n').map((line, index) => {
  const [name, className] = line.trim().split('\t');
  return { id: index + 1, name, className, registered: false };
});

const classList = [...new Set(students.map(s => s.className))];

export default function Lop4() {
  const [selectedClass, setSelectedClass] = useState(classList[0] || '');
  const [filteredStudents, setFilteredStudents] = useState([]);

  useEffect(() => {
    setFilteredStudents(students.filter(s => s.className === selectedClass));
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
