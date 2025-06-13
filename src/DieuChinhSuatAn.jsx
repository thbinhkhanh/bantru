import React, { useState, useEffect } from "react";
import { 
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Stack, TextField, MenuItem, 
  Select, FormControl, InputLabel, LinearProgress, Button, Checkbox 
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import vi from "date-fns/locale/vi";
import { getDocs, collection } from "firebase/firestore";
import { db } from "./firebase"; 

export default function ChotSoLieu({ onBack }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedClass, setSelectedClass] = useState("");
  const [classList, setClassList] = useState([]);
  const [dataList, setDataList] = useState([]);
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
            registered: true // 🔹 Đặt trạng thái mặc định là "Đã đăng ký"
          }));

        setDataList(studentData);

        const classes = [...new Set(studentData.map(s => s.LỚP))];
        classes.sort();
        setClassList(classes);

        if (classes.length > 0) {
          setSelectedClass(classes[0]); // 🔹 Đặt giá trị mặc định là lớp đầu tiên
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
  };

  const toggleRegister = (index) => { 
    const updated = [...dataList];
    updated[index].registered = !updated[index].registered;
    setDataList(updated);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const dataToSave = dataList.map(s => ({
        id: s.id,
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
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
        <Box sx={{ mb: 5 }}>
          <Typography
            variant="h5"
            fontWeight="bold"
            color="primary"
            align="center"
            sx={{ mb: 1 }}
          >
            ĐIỀU CHỈNH SUẤT ĂN
          </Typography>
          <Box sx={{ height: "1.5px", width: "100%", backgroundColor: "#1976d2", borderRadius: 1 }} />
        </Box>

        {/* 🔹 Chọn ngày và lớp */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center" justifyContent="center" sx={{ mb: 4 }}>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
            <DatePicker
              label="Chọn ngày"
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              renderInput={(params) => <TextField {...params} size="small" />}
            />
          </LocalizationProvider>

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Lớp</InputLabel>
            <Select value={selectedClass} label="Lớp" onChange={handleClassChange}>
              {classList.map((cls, idx) => (
                <MenuItem key={idx} value={cls}>{cls}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        {isLoading ? <LinearProgress /> : null}

        {/* 🔹 Hiển thị bảng thống kê */}
        <TableContainer component={Paper} sx={{ borderRadius: 2, mt: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: "bold", backgroundColor: "#1976d2", color: "white" }}>STT</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", backgroundColor: "#1976d2", color: "white" }}>HỌ VÀ TÊN</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", backgroundColor: "#1976d2", color: "white" }}>ĐĂNG KÝ</TableCell>
              </TableRow>
            </TableHead>
            
            <TableBody>
              {dataList.filter(s => s.LỚP === selectedClass).map((student, index) => (
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

        {/* 🔹 Nút lưu và nút quay lại */}
        <Stack spacing={2} sx={{ mt: 4, alignItems: "center" }}>
          <Button variant="contained" color="primary" onClick={handleSave} sx={{ width: 160, fontWeight: 600, py: 1 }} disabled={isSaving}>
            {isSaving ? "🔄 Đang lưu..." : "Lưu"}
          </Button>

          <Button onClick={onBack} color="secondary">
            ⬅️ Quay lại
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}