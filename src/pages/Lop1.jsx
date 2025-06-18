import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Stack, MenuItem, Select,
  FormControl, InputLabel, Checkbox, Card, LinearProgress, Alert
} from '@mui/material';
import { getDocs, getDoc, collection, doc, updateDoc, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useLocation } from 'react-router-dom';

export default function Lop1() {
  const location = useLocation();
  const useNewVersion = location.state?.useNewVersion ?? false;

  const [filteredStudents, setFilteredStudents] = useState([]);
  const [originalChecked, setOriginalChecked] = useState({});
  const [classList, setClassList] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  const saveTimeout = useRef(null);
  const intervalRef = useRef(null);

  const fetchStudents = async (className) => {
    setIsLoading(true);
    try {
      let snapshot;

      if (useNewVersion) {
        const q = query(collection(db, 'BANTRU'), where('lop', '==', className));
        snapshot = await getDocs(q);
      } else {
        snapshot = await getDocs(collection(db, 'BANTRU'));
      }

      const data = snapshot.docs
        .map((doc, idx) => {
          const d = doc.data();
          return {
            id: doc.id,
            ...d,
            stt: idx + 1,
            registered: d['huyDangKy'] === 'T',
            huyDangKy: d['huyDangKy'] || ''
          };
        })
        .filter(student =>
          (useNewVersion || student.lop === className) &&
          student.huyDangKy !== 'x' // ✅ Lọc theo yêu cầu
        );

      setFilteredStudents(data);

      const checkedMap = {};
      data.forEach(s => (checkedMap[s.id] = s.registered));
      setOriginalChecked(checkedMap);
    } catch (err) {
      console.error('❌ Lỗi khi tải học sinh:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchClassList = async () => {
      try {
        const docRef = doc(db, 'DANHSACH', 'K1');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const classes = data.list || [];
          setClassList(classes);
          if (classes.length > 0) {
            const firstClass = classes[0];
            setSelectedClass(firstClass);
            await fetchStudents(firstClass);
          }
        } else {
          console.error('❌ Không tìm thấy document K1 trong DANHSACH');
        }
      } catch (error) {
        console.error('❌ Lỗi khi tải danh sách lớp:', error);
      }
    };

    fetchClassList();
  }, []);

  const saveData = async () => {
    if (isSaving) return;
    const changed = filteredStudents.filter(s => s.registered !== originalChecked[s.id]);
    if (changed.length === 0) return;

    setIsSaving(true);
    try {
      const updates = changed.map(s =>
        updateDoc(doc(db, 'BANTRU', s.id), { 'huyDangKy': s.registered ? 'T' : '' })
      );
      await Promise.all(updates);

      const updatedChecked = { ...originalChecked };
      changed.forEach(s => (updatedChecked[s.id] = s.registered));
      setOriginalChecked(updatedChecked);
      setLastSaved(new Date());
    } catch (err) {
      console.error('❌ Lỗi khi lưu:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClassChange = async (event) => {
    await saveData();
    const selected = event.target.value;
    setSelectedClass(selected);
    fetchStudents(selected);
  };

  const toggleRegister = (index) => {
    const updated = [...filteredStudents];
    updated[index].registered = !updated[index].registered;
    setFilteredStudents(updated);

    clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(saveData, 5000);
  };

  useEffect(() => {
    intervalRef.current = setInterval(saveData, 120000);
    return () => clearInterval(intervalRef.current);
  }, [filteredStudents, originalChecked]);

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
      <Card sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 450, width: '100%', borderRadius: 4, boxShadow: '0 8px 30px rgba(0,0,0,0.15)', backgroundColor: 'white' }} elevation={10}>
        <Typography variant="h5" align="center" gutterBottom fontWeight="bold" color="primary" sx={{ mb: 4, borderBottom: '3px solid #1976d2', pb: 1 }}>
          DANH SÁCH HỌC SINH
        </Typography>

        <Stack direction="row" justifyContent="center" sx={{ mb: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Lớp</InputLabel>
            <Select value={selectedClass} label="Lớp" onChange={handleClassChange}>
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
          <TableContainer component={Paper} sx={{ borderRadius: 2, mt: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: 'white', px: { xs: 0.5, sm: 1, md: 2 } }}>STT</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: 'white', px: { xs: 0.5, sm: 1, md: 2 } }}>HỌ VÀ TÊN</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: 'white', px: { xs: 0.5, sm: 1, md: 2 } }}>ĐĂNG KÝ</TableCell>

                </TableRow>
              </TableHead>
              <TableBody>
                {filteredStudents.map((student, index) => (
                  <TableRow key={student.id}>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell>{student.hoVaTen || 'Không có tên'}</TableCell>
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
          <Alert severity="info" sx={{ mt: 3 }}>
            Đang lưu dữ liệu...
          </Alert>
        )}
        {lastSaved && !isSaving && (
          <Alert severity="success" sx={{ mt: 3 }}>
            Đã lưu lúc {lastSaved.toLocaleTimeString('vi-VN')}
          </Alert>
        )}
      </Card>
    </Box>
  );
}
