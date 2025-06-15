import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Stack, MenuItem, Select,
  FormControl, InputLabel, Checkbox, Card, LinearProgress, Snackbar
} from '@mui/material';
import { getDocs, collection, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Lop1() {
  const [allStudents, setAllStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [originalChecked, setOriginalChecked] = useState({});
  const [classList, setClassList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSaved, setLastSaved] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const saveTimeout = useRef(null);
  const intervalRef = useRef(null);

  // Fetch dữ liệu ban đầu
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const snapshot = await getDocs(collection(db, 'BANTRU'));
        const studentData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            registered: data['HỦY ĐK'] === 'T'
          };
        }).filter(student => student.LỚP.toString().startsWith('1'));

        setAllStudents(studentData);

        const classes = [...new Set(studentData.map(s => s.LỚP))].sort();
        setClassList(classes);

        if (classes.length > 0) {
          const firstClass = classes[0];
          setSelectedClass(firstClass);
          const filtered = studentData.filter(s => s.LỚP === firstClass)
            .map((s, idx) => ({ ...s, stt: idx + 1 }));

          setFilteredStudents(filtered);

          const checkedMap = {};
          filtered.forEach(s => checkedMap[s.id] = s.registered);
          setOriginalChecked(checkedMap);
        }
      } catch (err) {
        console.error('❌ Lỗi khi tải dữ liệu:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Lưu dữ liệu những dòng có thay đổi
  const saveData = async () => {
    if (isSaving) return; // tránh ghi đè

    const changed = filteredStudents.filter(s => s.registered !== originalChecked[s.id]);
    if (changed.length === 0) return;

    setIsSaving(true);
    try {
      const promises = changed.map(s => {
        const ref = doc(db, 'BANTRU', s.id);
        return updateDoc(ref, { 'HỦY ĐK': s.registered ? 'T' : '' });
      });
      await Promise.all(promises);

      const newChecked = { ...originalChecked };
      changed.forEach(s => newChecked[s.id] = s.registered);
      setOriginalChecked(newChecked);
      setLastSaved(new Date());
      setSnackbarOpen(true);
    } catch (err) {
      console.error('❌ Lỗi khi lưu:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Thay đổi lớp → lưu trước rồi mới chuyển
  const handleClassChange = async (event) => {
    await saveData(); // lưu trước khi chuyển lớp
    const selected = event.target.value;
    setSelectedClass(selected);

    const filtered = allStudents
      .filter(s => s.LỚP === selected)
      .map((s, idx) => ({ ...s, stt: idx + 1 }));

    setFilteredStudents(filtered);

    const checkedMap = {};
    filtered.forEach(s => checkedMap[s.id] = s.registered);
    setOriginalChecked(checkedMap);
  };

  // Cập nhật checkbox + debounce lưu sau 5s
  const toggleRegister = (index) => {
    const updated = [...filteredStudents];
    updated[index].registered = !updated[index].registered;
    setFilteredStudents(updated);

    clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(saveData, 5000);
  };

  // Lưu định kỳ mỗi 2 phút
  useEffect(() => {
    intervalRef.current = setInterval(saveData, 120000); // 2 phút
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [filteredStudents, originalChecked]);

  // Lưu khi rời tab, reload
  useEffect(() => {
    const beforeUnload = (e) => {
      if (filteredStudents.some(s => s.registered !== originalChecked[s.id])) {
        saveData();
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', beforeUnload);
    return () => window.removeEventListener('beforeunload', beforeUnload);
  }, [filteredStudents, originalChecked]);

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #e3f2fd, #bbdefb)', py: 6, px: 2, display: 'flex', justifyContent: 'center' }}>
      <Card sx={{ p: 4, maxWidth: 450, width: '100%', borderRadius: 4, boxShadow: '0 8px 30px rgba(0,0,0,0.15)', backgroundColor: 'white' }} elevation={10}>
        <Typography variant="h5" align="center" gutterBottom fontWeight="bold" color="primary" sx={{ mb: 4, borderBottom: '3px solid #1976d2', pb: 1 }}>
          DANH SÁCH HỌC SINH
        </Typography>

        <Stack direction="row" justifyContent="center" sx={{ mb: 4 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Lớp</InputLabel>
            <Select value={selectedClass || ""} label="Lớp" onChange={handleClassChange}>
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
          <TableContainer component={Paper} sx={{ borderRadius: 2, mt: 2, width: '100%' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: 'white', width: 40, py: 0.5, px: 1 }}>STT</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: 'white', py: 0.5, px: 1 }}>HỌ VÀ TÊN</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: 'white', py: 0.5, px: 1 }}>ĐĂNG KÝ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredStudents.map((student, index) => (
                  <TableRow key={index} hover>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell>{student['HỌ VÀ TÊN']}</TableCell>
                    <TableCell align="center">
                      <Checkbox
                        checked={student.registered ?? false}
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

        {isSaving && (
          <Box sx={{ width: '100%', mt: 2 }}>
            <LinearProgress />
            <Typography variant="body2" align="center" sx={{ mt: 1 }}>Đang lưu...</Typography>
          </Box>
        )}

        {lastSaved && !isSaving && (
          <Typography variant="body2" align="center" color="text.secondary" sx={{ mt: 2 }}>
            Đã lưu lúc {lastSaved.toLocaleTimeString()}
          </Typography>
        )}

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={2000}
          onClose={() => setSnackbarOpen(false)}
          message="✅ Đã lưu thành công"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
      </Card>
    </Box>
  );
}
