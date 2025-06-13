import React, { useState, useEffect } from "react";
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, Stack, MenuItem,
  Select, FormControl, InputLabel, Checkbox, Card, LinearProgress,
  TextField
} from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import vi from 'date-fns/locale/vi';
import { getDocs, collection } from "firebase/firestore";
import { db } from "./firebase"; 

export default function DieuChinhSuatAn({ onBack }) { 
  const [allStudents, setAllStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [classList, setClassList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const snapshot = await getDocs(collection(db, "BANTRU"));
        const studentData = snapshot.docs
          .map(doc => doc.data())
          .filter(data => data["HỦY ĐK"] === "") 
          .map(data => ({
            id: data.id,
            ...data,
            registered: true 
          }));

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
        console.error("❌ Lỗi khi tải dữ liệu từ Firebase:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleClassChange = (event) => {
    setSelectedClass(event.target.value);
    setFilteredStudents(allStudents.filter(s => s.LỚP === event.target.value));
  };

  const toggleRegister = (index) => { 
    const updated = [...filteredStudents];
    updated[index].registered = !updated[index].registered;
    setFilteredStudents(updated);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const dataToSave = filteredStudents.map(s => ({
        id: s.id,
        className: s.LỚP,
        registered: s.registered
      }));

      console.log("📤 Gửi lên dữ liệu:", JSON.stringify(dataToSave, null, 2));
      alert("Lưu thành công!");
    } catch (err) {
      console.error("❌ Lỗi khi lưu dữ liệu:", err);
      alert("Không thể lưu dữ liệu.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(to bottom, #e3f2fd, #bbdefb)", py: 6, px: 2, display: "flex", justifyContent: "center" }}>
      <Card sx={{ p: 4, maxWidth: 450, width: "100%", borderRadius: 4, boxShadow: "0 8px 30px rgba(0,0,0,0.15)", backgroundColor: "white" }} elevation={10}>
        <Typography variant="h5" align="center" gutterBottom fontWeight="bold" color="primary" sx={{ mb: 4, textShadow: "2px 2px 5px rgba(0,0,0,0.1)", borderBottom: "3px solid #1976d2", pb: 1 }}>
          ĐIỀU CHỈNH SUẤT ĂN
        </Typography>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center" sx={{ mb: 4 }}>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
            <DatePicker
              label="Chọn ngày"
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              renderInput={(params) => <TextField {...params} size="small" />}
            />
          </LocalizationProvider>

          <FormControl size="small" sx={{ minWidth: 120 }} >
            <InputLabel>Lớp</InputLabel>
            <Select value={selectedClass || ""} label="Lớp" onChange={handleClassChange}>
              {classList.map((cls, idx) => (
                <MenuItem key={idx} value={cls}>{cls}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        {isLoading ? <LinearProgress /> : null}

        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table size="small">
            {/* 🔹 Thêm dòng tiêu đề */}
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: "bold", backgroundColor: "#1976d2", color: "white" }}>STT</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", backgroundColor: "#1976d2", color: "white" }}>HỌ VÀ TÊN</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", backgroundColor: "#1976d2", color: "white" }}>ĐĂNG KÝ</TableCell>
              </TableRow>
            </TableHead>
            
            <TableBody>
              {filteredStudents.map((student, index) => (
                <TableRow key={index} hover>
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell>{student["HỌ VÀ TÊN"]}</TableCell>
                  <TableCell align="center">
                    <Checkbox checked={student.registered} onChange={() => toggleRegister(index)} size="small" color="primary" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Stack spacing={2} sx={{ mt: 4, alignItems: "center" }}>
          <Button variant="contained" color="primary" onClick={handleSave} sx={{ width: 160, fontWeight: 600, py: 1 }} disabled={isSaving}>
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