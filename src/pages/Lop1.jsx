import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, Stack, MenuItem,
  Select, FormControl, InputLabel, Checkbox, Card, LinearProgress
} from '@mui/material';

export default function Lop1() {
  const [allStudents, setAllStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [classList, setClassList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch('https://script.google.com/macros/s/AKfycbw5Yh0BkVrgAOyKjpxJktnx9C4g2IGK5wqghdhXp2SuDT5BkbwR7nQHH-hI3Gg1u8_qUg/exec?action=getLop1')
      .then(res => res.json())
      .then(response => {
        const rawData = response?.data ?? [];

        if (rawData.length === 0) {
          console.warn("Không có dữ liệu hoặc định dạng sai.");
          setIsLoading(false);
          return;
        }

        const data = rawData.map(row => ({
          stt: row[0],
          id: row[1],
          name: row[2],
          className: row[3],
          cancelled: row[4],
          isCancelled: (row[4] || '').toString().trim().toLowerCase() === 'x',
          registered: (row[5] || '').toString().trim().toUpperCase() === 'T'
        }));

        setAllStudents(data);

        const classes = [...new Set(data.map(s => s.className))];
        setClassList(classes);

        if (classes.length > 0) {
          const firstClass = classes[0];
          setSelectedClass(firstClass);
          setFilteredStudents(data.filter(s => s.className === firstClass));
        }

        setIsLoading(false);
      })
      .catch(err => {
        console.error('Lỗi khi tải dữ liệu:', err);
        setIsLoading(false);
      });
  }, []);

  const handleClassChange = (event) => {
    const selected = event.target.value;
    setSelectedClass(selected);
    setFilteredStudents(allStudents.filter(s => s.className === selected));
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

  const handleSave = () => {
    setIsSaving(true);

    const dataToSave = filteredStudents.map(s => ({
      id: s.id,
      className: s.className,
      registered: s.registered
    }));

    console.log("📤 Gửi lên dữ liệu:", JSON.stringify(dataToSave, null, 2));

    fetch('https://script.google.com/macros/s/AKfycbw5Yh0BkVrgAOyKjpxJktnx9C4g2IGK5wqghdhXp2SuDT5BkbwR7nQHH-hI3Gg1u8_qUg/exec', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'saveLop1', data: dataToSave })
    })
      .then(res => res.json())
      .then(result => {
        setIsSaving(false);
        console.log("✅ Phản hồi từ server:", result);
        if (result.success) {
          alert("Lưu thành công!");
        } else {
          alert("Lỗi lưu dữ liệu: " + result.message);
        }
      })
      .catch(err => {
        setIsSaving(false);
        console.error("❌ Lỗi kết nối:", err);
        alert("Không thể kết nối đến server.");
      });
  };



  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #e3f2fd, #bbdefb)', py: 6, px: 2, display: 'flex', justifyContent: 'center' }}>
      <Card sx={{ p: 4, maxWidth: 450, width: '100%', borderRadius: 4, boxShadow: '0 8px 30px rgba(0,0,0,0.15)', backgroundColor: 'white' }} elevation={10}>
        <Typography variant="h5" align="center" gutterBottom fontWeight="bold" color="primary" sx={{ mb: 4, textShadow: '2px 2px 5px rgba(0,0,0,0.1)', borderBottom: '3px solid #1976d2', pb: 1 }}>
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

        {isLoading && (
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', my: 2 }}>
            <Box sx={{ width: '50%' }}>
              <LinearProgress />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Đang tải dữ liệu học sinh...
            </Typography>
          </Box>
        )}

        {!isLoading && selectedClass && (
          <>
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
                  {filteredStudents.map((student, index) => {
                    const isCancelled = student.cancelled?.toLowerCase() === 'x';
                    return (
                      <TableRow
                        key={index}
                        hover
                        sx={{
                          backgroundColor: isCancelled ? '#f0f0f0' : 'inherit',
                        }}
                      >
                        <TableCell align="center">{student.stt}</TableCell>
                        <TableCell sx={{ color: isCancelled ? 'red' : 'inherit' }}>
                          {student.name}
                        </TableCell>
                        <TableCell align="center">
                          {!isCancelled ? (
                            <Checkbox
                              checked={student.registered ?? false}
                              onChange={() => toggleRegister(index)}
                              size="small"
                              color="primary"
                            />
                          ) : (
                            <Typography variant="body2" color="text.secondary"></Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            {isSaving && (
              <Box sx={{ width: '100%', mt: 2 }}>
                <LinearProgress />
              </Box>
            )}

            <Stack direction="row" justifyContent="center" sx={{ mt: 4 }}>
              <Button
                variant="contained"
                onClick={handleSave}
                sx={{ minWidth: 160, fontWeight: 600, py: 1 }}
                disabled={isSaving}
              >
                Lưu
              </Button>
            </Stack>
          </>
        )}
      </Card>
    </Box>
  );
}
