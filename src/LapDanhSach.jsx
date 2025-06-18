import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, Stack, MenuItem,
  Select, FormControl, InputLabel, Checkbox, Card, LinearProgress
} from '@mui/material';
import { getDocs, collection, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

export default function LapDanhSach({ onBack }) {
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
          const huyDangKy = data.huyDangKy || '';
          return {
            id: doc.id,
            ...data,
            registered: huyDangKy === '',
          };
        });

        setAllStudents(studentData);

        const classes = [...new Set(studentData.map(s => s.lop))].sort();
        setClassList(classes);

        if (classes.length > 0) {
          const firstClass = classes[0];
          setSelectedClass(firstClass);
          setFilteredStudents(
            studentData.filter(s => s.lop === firstClass).map((s, idx) => ({ ...s, stt: idx + 1 }))
          );
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
      .filter(s => s.lop === selected)
      .map((s, idx) => ({ ...s, stt: idx + 1 }));

    setFilteredStudents(filtered);
  };

  const toggleRegister = (index) => {
    const updated = [...filteredStudents];
    updated[index].registered = !updated[index].registered;
    setFilteredStudents(updated);

    setAllStudents(prev => prev.map(student =>
      student.id === updated[index].id ? { ...student, registered: updated[index].registered } : student
    ));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      for (let student of filteredStudents) {
        const huyDangKy = student.registered ? '' : 'x';
        await updateDoc(doc(db, 'BANTRU', student.id), {
          huyDangKy
        });
      }

      alert('✅ Lưu thành công!');
    } catch (err) {
      console.error('❌ Lỗi khi lưu dữ liệu:', err);
      alert('❌ Không thể lưu dữ liệu.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #e3f2fd, #bbdefb)', pt: 0, px: 1, display: 'flex', justifyContent: 'center' }}>
      <Card
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          maxWidth: { xs: '98%', sm: 390 },
          width: '100%',
          borderRadius: 4,
          boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
          backgroundColor: 'white',
        }}
        elevation={10}
      >

        <Typography variant="h5" align="center" gutterBottom fontWeight="bold" color="primary" sx={{ mb: 2, textShadow: '2px 2px 5px rgba(0,0,0,0.1)', pb: 1 }}>
          LẬP DANH SÁCH BÁN TRÚ
        </Typography>
        <Box sx={{ height: "2px", width: "100%", backgroundColor: "#1976d2", borderRadius: 1, mt: 0, mb: 4 }} />
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
            <Box sx={{ width: '50%' }}><LinearProgress /></Box>
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
                  <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: 'white', width: 40, py: 0.5, px: { xs: 0.5, sm: 1, md: 2 } }}>
                    STT
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: 'white', py: 0.5, px: { xs: 0.5, sm: 1, md: 2 } }}>
                    HỌ VÀ TÊN
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: 'white', py: 0.5, px: { xs: 0.5, sm: 1, md: 2 } }}>
                    ĐĂNG KÝ
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredStudents.map((student, index) => (
                  <TableRow key={index} hover>
                    <TableCell align="center" sx={{ py: 0.5, px: 1 }}>{index + 1}</TableCell>
                    <TableCell sx={{ py: 0.5, px: 1 }}>{student.hoVaTen}</TableCell>
                    <TableCell align="center" sx={{ py: 0.5, px: 1 }}>
                      <Checkbox
                        checked={student.huyDangKy !== 'x' || student.registered}
                        onChange={() => toggleRegister(index)}
                        size="small"
                        color="primary"
                        disabled={student.huyDangKy !== 'x'}
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
          <Button onClick={onBack} color="secondary">⬅️ Quay lại</Button>
        </Stack>
      </Card>
    </Box>
  );
}
