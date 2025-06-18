import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, Stack, MenuItem,
  Select, FormControl, InputLabel, Checkbox, Card, LinearProgress,
  Alert
} from '@mui/material';
import { getDocs, collection, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { MySort } from './utils/MySort'; // 🆕

export default function LapDanhSach({ onBack }) {
  const [allStudents, setAllStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [classList, setClassList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [alertInfo, setAlertInfo] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const snapshot = await getDocs(collection(db, 'BANTRU'));
        const studentData = snapshot.docs.map(doc => {
          const data = doc.data();
          const huyDangKy = data.huyDangKy || '';
          const editable = huyDangKy === 'x'; // Chỉ cho phép chỉnh nếu là "x"
          return {
            id: doc.id,
            ...data,
            registered: !editable, // true nếu không được chỉnh
            originalRegistered: !editable, // để tránh lưu lại về sau
            editable,
          };
        });

        setAllStudents(studentData);

        const classes = [...new Set(studentData.map(s => s.lop))].sort();
        setClassList(classes);

        if (classes.length > 0) {
          const firstClass = classes[0];
          setSelectedClass(firstClass);

          const filtered = MySort(
            studentData.filter(s => s.lop === firstClass) // ✅ Sử dụng studentData
          ).map((s, idx) => ({ ...s, stt: idx + 1 })); // 🆕 Sắp xếp và gán lại STT

          setFilteredStudents(filtered);
        }

      } catch (err) {
        console.error('❌ Lỗi khi tải dữ liệu từ Firebase:', err);
        setAlertInfo({
          open: true,
          message: '❌ Lỗi khi tải dữ liệu từ Firebase.',
          severity: 'error'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleClassChange = (event) => {
    const selected = event.target.value;
    setSelectedClass(selected);
    const filtered = MySort(
      allStudents.filter(s => s.lop === selected)
    ).map((s, idx) => ({ ...s, stt: idx + 1 })); // ✅ Sắp đúng theo tên
    setFilteredStudents(filtered);
    setAlertInfo({ open: false, message: '', severity: 'success' });
  };

  const toggleRegister = (index) => {
    const updated = [...filteredStudents];
    updated[index].registered = !updated[index].registered;
    setFilteredStudents(updated);
    setAllStudents(prev =>
      prev.map(student =>
        student.id === updated[index].id
          ? { ...student, registered: updated[index].registered }
          : student
      )
    );
    setAlertInfo({ open: false, message: '', severity: 'success' });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setAlertInfo({ open: false, message: '', severity: 'success' });
    try {
      const changedStudents = filteredStudents.filter(
        s => s.registered !== s.originalRegistered
      );

      for (let student of changedStudents) {
        const huyDangKy = student.registered ? 'T' : '';
        await updateDoc(doc(db, 'BANTRU', student.id), { huyDangKy });
      }

      setAlertInfo({
        open: true,
        message: changedStudents.length > 0
          ? '✅ Lưu thành công!'
          : '✅ Không có thay đổi nào để lưu.',
        severity: 'success'
      });

      setFilteredStudents(prev =>
        prev.map(student => ({
          ...student,
          originalRegistered: student.registered
        }))
      );
    } catch (err) {
      console.error('❌ Lỗi khi lưu dữ liệu:', err);
      setAlertInfo({ open: true, message: '❌ Không thể lưu dữ liệu.', severity: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #e3f2fd, #bbdefb)', pt: 0, px: 1, display: 'flex', justifyContent: 'center' }}>
      <Card sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 400, width: '100%', borderRadius: 4, boxShadow: 3 }}>
        <Typography variant="h5" align="center" fontWeight="bold" color="primary" gutterBottom>
          LẬP DANH SÁCH BÁN TRÚ
        </Typography>
        <Box sx={{ height: 2, backgroundColor: '#1976d2', borderRadius: 1, mb: 3 }} />
        <Stack direction="row" justifyContent="center" sx={{ mb: 3 }}>
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
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 3 }}>
            <Box sx={{ width: '50%' }}><LinearProgress /></Box>
            <Typography variant="body2" sx={{ mt: 1 }}>Đang tải dữ liệu học sinh...</Typography>
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: 'white', px: { xs: 1, sm: 1, md: 2 } }}>STT</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: 'white', px: { xs: 0.5, sm: 1, md: 2 } }}>HỌ VÀ TÊN</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: 'white', px: { xs: 0.5, sm: 1, md: 1 } }}>ĐĂNG KÝ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredStudents.map((student, index) => (
                  <TableRow key={index} hover>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell>{student.hoVaTen}</TableCell>
                    <TableCell align="center">
                      <Checkbox
                        checked={student.registered}
                        onChange={() => toggleRegister(index)}
                        disabled={!student.editable}
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

        <Stack spacing={2} sx={{ mt: 4, alignItems: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={isSaving}
            sx={{ width: 160, fontWeight: 600, py: 1 }}
          >
            Lưu
          </Button>

          {(isSaving || alertInfo.open) && (
            <Alert severity={isSaving ? 'info' : alertInfo.severity} sx={{ width: 1 }}>
              {isSaving ? '🔄 Đang lưu dữ liệu...' : alertInfo.message}
            </Alert>
          )}

          <Button onClick={onBack} color="secondary">
            ⬅️ Quay lại
          </Button>
        </Stack>
      </Card>
    </Box>
  );
}