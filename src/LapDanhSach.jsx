import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, Stack, MenuItem,
  Select, FormControl, InputLabel, Checkbox, Card, LinearProgress
} from '@mui/material';
import { getDocs, collection } from 'firebase/firestore';
import { db } from './firebase'; // ✅ Đảm bảo Firebase được import đúng cách

export default function LapDanhSach({ onBack }) { // ✅ Nhận `onBack` từ props
  const [allStudents, setAllStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [classList, setClassList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const snapshot = await getDocs(collection(db, 'BANTRU'));
        const studentData = snapshot.docs.map(doc => {
          const data = doc.data();
          const huyDK = data['HỦY ĐK'];
          return {
            id: doc.id,
            ...data,
            registered: huyDK !== 'x',   // nếu không phải 'x' thì là đăng ký (checkbox = true)
            isLocked: huyDK !== 'x'      // nếu không phải 'x' thì không được sửa (disabled = true)
          };
        });

        setAllStudents(studentData);

        const classes = [...new Set(studentData.map(s => s.LỚP))];
        classes.sort();
        setClassList(classes);

        if (classes.length > 0) {
          const firstClass = classes[0];
          setSelectedClass(firstClass);
          setFilteredStudents(studentData.filter(s => s.LỚP === firstClass));
        }
      } catch (err) {
        console.error('❌ Lỗi khi tải dữ liệu từ Firebase:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);


  const handleClassChange = (event) => {
    const selected = event.target.value;
    setSelectedClass(selected);

    const filtered = allStudents
      .filter(s => s.LỚP === selected)
      .map((s, idx) => ({
        ...s,
        stt: idx + 1 // Đánh lại STT từ 1
      }));

    setFilteredStudents(filtered);
  };

  const toggleRegister = (index) => {
    const updated = [...filteredStudents];
    updated[index].registered = !updated[index].registered;
    setFilteredStudents(updated);

    // Đồng bộ lại allStudents để giữ trạng thái khi đổi lớp
    setAllStudents(prev => prev.map(student =>
      student.id === updated[index].id ? { ...student, registered: updated[index].registered } : student
    ));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const dataToSave = filteredStudents.map(s => ({
        id: s.id,
        className: s.LỚP,
        registered: s.registered
      }));

      console.log('📤 Gửi lên dữ liệu:', JSON.stringify(dataToSave, null, 2));
      alert('Lưu thành công!');
    } catch (err) {
      console.error('❌ Lỗi khi lưu dữ liệu:', err);
      alert('Không thể lưu dữ liệu.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #e3f2fd, #bbdefb)', pt: 0, px: 1, display: 'flex', justifyContent: 'center' }}>
      <Card sx={{ p: 4, maxWidth: 450, width: '100%', borderRadius: 4, boxShadow: '0 8px 30px rgba(0,0,0,0.15)', backgroundColor: 'white' }} elevation={10}>
        <Typography variant="h5" align="center" gutterBottom fontWeight="bold" color="primary" sx={{ mb: 4, textShadow: '2px 2px 5px rgba(0,0,0,0.1)', borderBottom: '3px solid #1976d2', pb: 1 }}>
          LẬP DANH SÁCH BÁN TRÚ
        </Typography>

        <Stack direction="row" justifyContent="center" sx={{ mb: 4 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Lớp</InputLabel>
            <Select value={selectedClass || ''} label="Lớp" onChange={handleClassChange}>
              {classList.map((cls, idx) => (
                <MenuItem key={idx} value={cls}>{cls}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        {isLoading ? (
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', my: 2 }}>
            <Box sx={{ width: '50%' }}>
              <LinearProgress />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Đang tải dữ liệu học sinh...
            </Typography>
          </Box>
        ) : (
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: 2,
              mt: 2,
              ml: { xs: -1, sm: 0 },
              mr: { xs: -1, sm: 0 },
              width: { xs: 'calc(100% + 16px)', sm: '100%' },
            }}
          >
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: 'bold',
                      backgroundColor: '#1976d2',
                      color: 'white',
                      width: 40,
                      py: 0.5,
                      px: 1,
                    }}
                  >
                    STT
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: 'bold',
                      backgroundColor: '#1976d2',
                      color: 'white',
                      py: 0.5,
                      px: 1,
                    }}
                  >
                    HỌ VÀ TÊN
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: 'bold',
                      backgroundColor: '#1976d2',
                      color: 'white',
                      py: 0.5,
                      px: 1,
                    }}
                  >
                    ĐĂNG KÝ
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredStudents.map((student, index) => (
                  <TableRow key={index} hover>
                    <TableCell align="center" sx={{ py: 0.5, px: 1 }}>
                      {index + 1}
                    </TableCell>
                    <TableCell sx={{ py: 0.5, px: 1 }}>
                      {student['HỌ VÀ TÊN']}
                    </TableCell>
                    <TableCell align="center" sx={{ py: 0.5, px: 1 }}>
                      <Checkbox
                        checked={student.registered}
                        onChange={() => toggleRegister(index)}
                        size="small"
                        color="primary"
                        disabled={student.isLocked}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

        )}

        <Stack spacing={2} sx={{ mt: 4, alignItems: "center" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            sx={{ width: 160, fontWeight: 600, py: 1 }}
            disabled={isSaving}
          >
            {isSaving ? "🔄 Đang lưu..." : "Lưu"}
          </Button>

          <Button onClick={onBack} color="secondary">
            ⬅️ Quay lại
          </Button>
        </Stack>
      </Card>
    </Box>
  );
}