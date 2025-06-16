import React, { useState, useEffect } from "react";
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Stack, MenuItem,
  Select, FormControl, InputLabel, LinearProgress, Button, Checkbox, Alert
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import vi from "date-fns/locale/vi";
import { getDocs, getDoc, collection, query, where, doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

export default function DieuChinhSuatAn({ onBack }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedClass, setSelectedClass] = useState(null);
  const [classList, setClassList] = useState([]);
  const [dataList, setDataList] = useState([]);
  const [originalChecked, setOriginalChecked] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(null);
  
  useEffect(() => {
    if (saveSuccess !== null) {
      const timer = setTimeout(() => {
        setSaveSuccess(null);
      }, 5000); // Ẩn sau 10 giây
      return () => clearTimeout(timer);
    }
  }, [saveSuccess]);

  useEffect(() => {
    const fetchClassList = async () => {
      try {
        const docRef = doc(db, "DANHSACH", "TRUONG");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setClassList(data.list || []);
          if (data.list.length > 0) {
            setSelectedClass(data.list[0]);
            await fetchStudents(data.list[0]);
          }
        }
      } catch (err) {
        console.error("❌ Lỗi khi tải danh sách lớp:", err);
      }
    };
    fetchClassList();
  }, []);

  const fetchStudents = async (className) => {
    setIsLoading(true);
    try {
      const q = query(collection(db, "BANTRU"), where("lop", "==", className));
      const snapshot = await getDocs(q);

      const selected = new Date(selectedDate);
      selected.setHours(0, 0, 0, 0);
      const adjustedDate = new Date(selected.getTime() + 7 * 60 * 60 * 1000);
      const selectedDateStr = adjustedDate.toISOString().split("T")[0];

      const students = [];
      const checkedMap = {};

      snapshot.docs.forEach((docSnap, index) => {
        const d = docSnap.data();
        const registeredData = d.data?.[selectedDateStr];
        const maDinhDanh = d.maDinhDanh;

        const student = {
          id: docSnap.id, // vẫn giữ lại để update
          maDinhDanh,
          hoVaTen: d.hoVaTen,
          registered: registeredData === "T",
          disabled: registeredData === undefined || registeredData === null,
          stt: index + 1,
        };

        students.push(student);
        checkedMap[maDinhDanh] = student.registered;
      });

      setDataList(students);
      setOriginalChecked(checkedMap);
    } catch (err) {
      console.error("❌ Lỗi khi tải học sinh:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedClass) {
      fetchStudents(selectedClass);
    }
  }, [selectedDate]);

  const saveData = async () => {
    if (isSaving) return;

    const changed = dataList.filter((s) => s.registered !== originalChecked[s.maDinhDanh]);
    if (changed.length === 0) {
      setSaveSuccess(null);
      return;
    }

    setIsSaving(true);
    setSaveSuccess(null);

    try {
      const selectedDateStr = new Date(selectedDate.getTime() + 7 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

      await Promise.all(
        changed.map(async (s) => {
          const docRef = doc(db, "BANTRU", s.id); // cập nhật qua doc ID gốc
          await updateDoc(docRef, {
            [`data.${selectedDateStr}`]: s.registered ? "T" : "",
          });
        })
      );

      const updated = { ...originalChecked };
      changed.forEach((s) => (updated[s.maDinhDanh] = s.registered));
      setOriginalChecked(updated);
      setSaveSuccess(true);
    } catch (err) {
      console.error("❌ Lỗi khi lưu:", err);
      setSaveSuccess(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClassChange = async (event) => {
    await saveData();
    const selected = event.target.value;
    setSelectedClass(selected);
    await fetchStudents(selected);
  };

  const handleDateChange = (newValue) => {
    if (newValue instanceof Date && !isNaN(newValue)) {
      setSelectedDate(newValue);
    }
  };

  const toggleRegister = (index) => {
    setDataList((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        registered: !updated[index].registered,
      };
      return updated;
    });
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", px: 1 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h5" fontWeight="bold" color="primary" align="center" sx={{ mb: 2 }}>
          ĐIỀU CHỈNH SUẤT ĂN
          <Box sx={{ height: 2, width: "100%", backgroundColor: "#1976d2", mt: 1, mb: 4 }} />
        </Typography>

        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 3 }} flexWrap="wrap">
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
            <DatePicker
              label="Chọn ngày"
              value={selectedDate}
              onChange={handleDateChange}
              slotProps={{
                textField: {
                  size: "small",
                  sx: { minWidth: 80, maxWidth: 165, "& input": { textAlign: "center" } },
                },
              }}
            />
          </LocalizationProvider>

          <FormControl size="small" sx={{ minWidth: 80, width: 120 }}>
            <InputLabel>Lớp</InputLabel>
            <Select value={selectedClass || ""} label="Lớp" onChange={handleClassChange}>
              {classList.map((cls, idx) => (
                <MenuItem key={idx} value={cls}>
                  {cls}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        {isLoading && <LinearProgress />}

        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#1976d2" }}>
                <TableCell align="center" sx={{ color: "white", width: 40 }}>STT</TableCell>
                <TableCell align="center" sx={{ color: "white" }}>HỌ VÀ TÊN</TableCell>
                <TableCell align="center" sx={{ color: "white" }}>ĐĂNG KÝ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataList.map((student, index) => (
                <TableRow key={student.maDinhDanh}>
                  <TableCell align="center">{student.stt}</TableCell>
                  <TableCell>{student.hoVaTen}</TableCell>
                  <TableCell align="center">
                    <Checkbox
                      checked={student.registered}
                      onChange={() => toggleRegister(index)}
                      disabled={student.disabled}
                      size="small"
                      color="primary"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Stack spacing={2} sx={{ mt: 4, alignItems: "center" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={saveData}
            sx={{ width: 160, fontWeight: 600, py: 1 }}
            disabled={isSaving}
          >
            {isSaving ? "🔄 Cập nhật..." : "Cập nhật"}
          </Button>

          {/* ✅ Đặt Alert NGAY DƯỚI nút "Lưu" này */}
          {isSaving && (
            <Alert severity="info" sx={{ mt: 2, width: "100%" }}>
              🔄 Đang cập nhật dữ liệu...
            </Alert>
          )}

          {saveSuccess === true && !isSaving && (
            <Alert severity="success" sx={{ mt: 2, width: "100%" }}>
              ✅ Cập nhật thành công!
            </Alert>
          )}

          {saveSuccess === false && !isSaving && (
            <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
              ❌ Cập nhật thất bại! Vui lòng kiểm tra lại.
            </Alert>
          )}

          <Button onClick={onBack} color="secondary">
            ⬅️ Quay lại
          </Button>
        </Stack>

      </Paper>
    </Box>
  );
}
