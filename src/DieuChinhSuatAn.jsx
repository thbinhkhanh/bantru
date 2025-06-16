import React, { useState, useEffect, useRef } from "react";
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
  const [lastSaved, setLastSaved] = useState(null);

  const saveTimeout = useRef(null);
  const intervalRef = useRef(null);

  // 🛠 Lấy danh sách lớp từ `DANHSACH/TRUONG/list`
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
        } else {
          console.error("❌ Không tìm thấy document TRUONG trong DANHSACH");
        }
      } catch (err) {
        console.error("❌ Lỗi khi tải danh sách lớp:", err);
      }
    };

    fetchClassList();
  }, []);

  // 🛠 Lấy danh sách học sinh theo lớp đã chọn & ngày đã chọn
  const fetchStudents = async (className) => {
    setIsLoading(true);
    try {
      const q = query(collection(db, "BANTRU"), where("lop", "==", className));
      const snapshot = await getDocs(q);

      // 🌟 Chuyển ngày chọn sang `YYYY-MM-DD`
      const selected = new Date(selectedDate);
      selected.setHours(0, 0, 0, 0);
      const adjustedDate = new Date(selected.getTime() + 7 * 60 * 60 * 1000);
      const selectedDateStr = adjustedDate.toISOString().split("T")[0];

      console.log("📅 Ngày chọn:", selectedDateStr);

      let foundData = false;

      const students = snapshot.docs.map((doc, index) => {
        const d = doc.data();
        const registeredData = d.data?.[selectedDateStr];

        if (registeredData !== undefined && registeredData !== null) foundData = true;

        return {
          id: doc.id,
          hoVaTen: d.hoVaTen,
          registered: registeredData === "T",
          disabled: registeredData === undefined || registeredData === null,
          stt: index + 1,
        };
      });

      console.log("🔍 Có dữ liệu thực sự cho ngày này?", foundData);

      setDataList(students);
    } catch (err) {
      console.error("❌ Lỗi khi tải danh sách học sinh:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // 🛠 Khi người dùng chọn lớp mới, cập nhật danh sách
  const handleClassChange = async (event) => {
    await saveData();
    const selected = event.target.value;
    setSelectedClass(selected);
    await fetchStudents(selected);
  };

  // 🛠 Khi người dùng chọn ngày mới, cập nhật danh sách
  const handleDateChange = async (newValue) => {
    if (newValue instanceof Date && !isNaN(newValue)) {
      setSelectedDate(newValue);
    }
  };

  // 🛠 Theo dõi `selectedDate`, khi ngày thay đổi thì cập nhật danh sách học sinh
  useEffect(() => {
    if (selectedClass) {
      fetchStudents(selectedClass);
    }
  }, [selectedDate]);

  const saveData = async () => {
    if (isSaving) return;
    const changed = dataList.filter(s => s.registered !== originalChecked[s.id]);
    if (changed.length === 0) return;

    setIsSaving(true);
    try {
      const updates = changed.map(s =>
        updateDoc(doc(db, "BANTRU", s.id), { huyDangKy: s.registered ? "T" : "" })
      );
      await Promise.all(updates);

      const updatedChecked = { ...originalChecked };
      changed.forEach(s => (updatedChecked[s.id] = s.registered));
      setOriginalChecked(updatedChecked);
      setLastSaved(new Date());
    } catch (err) {
      console.error("❌ Lỗi khi lưu:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleRegister = (index) => {
    const updated = [...dataList];
    updated[index].registered = !updated[index].registered;
    setDataList(updated);

    clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(saveData, 5000);
  };

  useEffect(() => {
    intervalRef.current = setInterval(saveData, 120000);
    return () => clearInterval(intervalRef.current);
  }, [dataList, originalChecked]);

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 0, px: 1 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
        <Box sx={{ mb: 5 }}>
          <Typography variant="h5" fontWeight="bold" color="primary" align="center" sx={{ mb: 1 }}>
            ĐIỀU CHỈNH SUẤT ĂN
          </Typography>
          <Box sx={{ height: "2px", width: "100%", backgroundColor: "#1976d2", borderRadius: 1, mt: 1, mb: 3 }} />
        </Box>

        {/* 🔹 Chọn ngày và lớp */}
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" flexWrap="wrap" sx={{ mb: 4 }}>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
            <DatePicker
              label="Chọn ngày"
              value={selectedDate}
              onChange={handleDateChange}
              slotProps={{
                textField: { size: "small", sx: { minWidth: 80, maxWidth: 165, "& input": { textAlign: "center" } } },
              }}
            />
          </LocalizationProvider>

          <FormControl size="small" sx={{ minWidth: 80, width: 120, px: 1 }}>
            <InputLabel>Lớp</InputLabel>
            <Select
              value={selectedClass || ""}
              label="Lớp"
              onChange={handleClassChange}
              sx={{ px: 1 }}
            >
              {classList.map((cls, idx) => (
                <MenuItem key={idx} value={cls}>{cls}</MenuItem>
              ))}
            </Select>
          </FormControl>

        </Stack>

        {isLoading && <LinearProgress />}

        <TableContainer component={Paper} sx={{ borderRadius: 2, mt: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#1976d2" }}>
                <TableCell align="center" sx={{ color: "white", width: 40, px: 1 }}>
                  STT
                </TableCell>
                <TableCell align="center" sx={{ color: "white", px: 1 }}>
                  HỌ VÀ TÊN
                </TableCell>
                <TableCell align="center" sx={{ color: "white", px: 1 }}>
                  ĐĂNG KÝ
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {dataList.map((student, index) => (
                <TableRow key={student.id} hover>
                  <TableCell align="center" sx={{ px: 1 }}>{student.stt}</TableCell>
                  <TableCell sx={{ px: 1 }}>{student.hoVaTen}</TableCell>
                  <TableCell align="center" sx={{ px: 1 }}>
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

        {isSaving && <Alert severity="info" sx={{ mt: 3 }}>Đang lưu dữ liệu...</Alert>}
        {lastSaved && !isSaving && <Alert severity="success" sx={{ mt: 3 }}>Đã lưu lúc {lastSaved.toLocaleTimeString()}</Alert>}

        <Stack spacing={2} sx={{ mt: 4, alignItems: "center" }}>
          <Button onClick={onBack} color="secondary">⬅️ Quay lại</Button>
        </Stack>
      </Paper>
    </Box>
  );
}
                  