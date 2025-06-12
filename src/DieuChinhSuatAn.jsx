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
  TextField,
  Button,
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Checkbox,
  LinearProgress,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import vi from 'date-fns/locale/vi';

export default function DieuChinhSuatAn() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://script.google.com/macros/s/AKfycbxZMwfv7rel4UWN2fF8sHlbrwwuRhsQIpYh3vLVLVUxsQcwpnsdecuhORO6WBCziehpwQ/exec?action=GET_DATA"
        );
        const json = await response.json();
        if (Array.isArray(json.data)) {
          const processed = json.data.map((row, index) => ({
            id: index + 1,
            hoTen: row[2],
            lop: row[3],
            isK: row[4] === "K",
            registered: false,
          }));
          setStudents(processed);
          const uniqueClasses = [...new Set(processed.map((s) => s.lop))].filter(Boolean);
          setClasses(uniqueClasses);
          if (uniqueClasses.length > 0) {
            const firstClass = uniqueClasses[0];
            setSelectedClass(firstClass);
            setFilteredStudents(
              processed
                .filter((s) => s.lop === firstClass)
                .map((s, index) => ({ ...s, id: index + 1 }))
            );
          }
        } else {
          console.error("Dữ liệu trả về không hợp lệ:", json);
        }
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleClassChange = (event) => {
    const classValue = event.target.value;
    setSelectedClass(classValue);
    setFilteredStudents(
      students
        .filter((s) => s.lop === classValue)
        .map((s, index) => ({ ...s, id: index + 1 }))
    );
  };

  const toggleRegister = (index) => {
    const updated = [...filteredStudents];
    updated[index].registered = !updated[index].registered;
    setFilteredStudents(updated);
  };

  const handleSave = () => {
    const registeredStudents = filteredStudents.filter((s) => s.registered);
    console.log('Dữ liệu lưu:', registeredStudents);
    alert('Đã lưu dữ liệu đăng ký!');
  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4, p: 3 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          fontWeight="bold"
          color="primary"
          sx={{ mb: 5 }}
        >
          ĐIỀU CHỈNH SUẤT ĂN
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

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          alignItems="center"
          justifyContent="center"
          sx={{ mb: 3 }}
        >
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
              {classes.map((cls, idx) => (
                <MenuItem key={idx} value={cls}>
                  {cls}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        {loading ? (
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', my: 2 }}>
            <Box sx={{ width: '50%' }}>
              <LinearProgress />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Đang tải dữ liệu học sinh...
            </Typography>
          </Box>
        ) : selectedClass ? (
          <>
            <TableContainer component={Paper} sx={{ borderRadius: 2, mt: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell
                      align="center"
                      sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: 'white' }}
                    >
                      STT
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: 'white' }}
                    >
                      HỌ VÀ TÊN
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: 'white' }}
                    >
                      ĐĂNG KÝ
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredStudents.map((student, index) => (
                    <TableRow
                      key={index}
                      hover // <-- Thêm dòng này để kích hoạt hiệu ứng hover của MUI
                      sx={{
                        backgroundColor: student.isK ? '#f0f0f0' : 'inherit',
                      }}
                    >
                      <TableCell
                        align="center"
                        sx={{ py: 0.5, color: student.isK ? 'red' : 'inherit' }}
                      >
                        {index + 1}
                      </TableCell>
                      <TableCell
                        sx={{ py: 0.5, color: student.isK ? 'red' : 'inherit' }}
                      >
                        {student.hoTen}
                      </TableCell>
                      <TableCell align="center" sx={{ py: 0.5 }}>
                        {!student.isK && (
                          <Checkbox
                            checked={student.registered}
                            onChange={() => toggleRegister(index)}
                            size="small"
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Stack direction="row" justifyContent="center" sx={{ mt: 3 }}>
              <Button variant="contained" onClick={handleSave} sx={{ minWidth: 140 }}>
                Lưu
              </Button>
            </Stack>
          </>
        ) : null}
      </Paper>
    </Box>
  );
}
