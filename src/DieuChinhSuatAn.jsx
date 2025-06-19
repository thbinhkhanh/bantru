import React, { useState, useEffect } from "react";
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Stack, MenuItem,
  Select, FormControl, InputLabel, LinearProgress, Button,
  Checkbox, Alert, Card, CardContent
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import vi from "date-fns/locale/vi";
import { getDocs, getDoc, collection, query, where, doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { MySort } from './utils/MySort';

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
      }, 5000);
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
          id: docSnap.id,
          maDinhDanh,
          hoVaTen: d.hoVaTen,
          registered: registeredData === "T",
          disabled: registeredData === undefined || registeredData === null,
          stt: index + 1,
        };

        students.push(student);
        checkedMap[maDinhDanh] = student.registered;
      });

      const sorted = MySort(students).map((s, idx) => ({ ...s, stt: idx + 1 }));
      setDataList(sorted);
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

    const now = new Date();
    const selectedMonth = selectedDate.getMonth();
    const currentMonth = now.getMonth();
    const selectedYear = selectedDate.getFullYear();
    const currentYear = now.getFullYear();

    if (selectedYear < currentYear || (selectedYear === currentYear && selectedMonth < currentMonth)) {
      setSaveSuccess("tooEarly");
      return;
    }

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
          const docRef = doc(db, "BANTRU", s.id);
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
    <Box sx={{ display: "flex", justifyContent: "center", mt: 0 }}>
      <Card
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            maxWidth: 450,
            width: { xs: '98%', sm: '100%' },
            borderRadius: 4,
            boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
            backgroundColor: 'white',
          }}
          elevation={10}
        >
          <CardContent sx={{ p: 0 }}>
            {/* ✅ Bọc tiêu đề và gạch xanh để tạo khoảng cách giống ThongKeThang */}
            <Box sx={{ mb: 5 }}>
              <Typography
                variant="h5"
                align="center"
                fontWeight="bold"
                color="primary"
                gutterBottom
              >
                ĐIỀU CHỈNH SUẤT ĂN
              </Typography>
              <Box
                sx={{
                  height: "2.5px",
                  width: "100%",
                  backgroundColor: "#1976d2",
                  borderRadius: 1,
                  mt: 2,
                  mb: 4,
                }}
              />
            </Box>

          <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" sx={{ mb: 3 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
              <DatePicker
                label="Chọn ngày"
                value={selectedDate}
                onChange={handleDateChange}
                slotProps={{
                  textField: {
                    size: "small",
                    sx: {
                      minWidth: 150,
                      maxWidth: 180,
                      "& input": { textAlign: "center" },
                    },
                  },
                }}
              />
            </LocalizationProvider>

            <FormControl size="small" sx={{ minWidth: 120 }}>
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

          <TableContainer
            component={Paper}
            elevation={2}
            sx={{
              borderRadius: 2,
              border: "1px solid #e0e0e0",
              mt: 2
            }}
          >

            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: 'white', px: { xs: 0.5, sm: 1, md: 2 } }}>STT</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: 'white', px: { xs: 0.5, sm: 1, md: 2 } }}>HỌ VÀ TÊN</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: 'white', px: { xs: 0.5, sm: 1, md: 2 } }}>ĐĂNG KÝ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataList.map((student, index) => (
                  <TableRow key={student.maDinhDanh} hover>
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

          <Stack spacing={2} sx={{ mt: 3, alignItems: "center" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={saveData}
              disabled={isSaving}
              sx={{ width: 160, fontWeight: 600 }}
            >
              {isSaving ? "🔄 Cập nhật..." : "Cập nhật"}
            </Button>

            {saveSuccess === "tooEarly" && (
              <Alert severity="warning" sx={{ textAlign: 'left' }}>
                ⚠️ Không thể điều chỉnh suất ăn trước tháng hiện tại.
              </Alert>
            )}
            {saveSuccess === true && (
              <Alert severity="success" sx={{ textAlign: 'left' }}>
                ✅ Cập nhật thành công!
              </Alert>
            )}
            {saveSuccess === false && (
              <Alert severity="error" sx={{ textAlign: 'left' }}>
                ❌ Lỗi khi lưu dữ liệu!
              </Alert>
            )}
            {isSaving && (
              <Alert severity="info" sx={{ textAlign: 'left' }}>
                🔄 Đang lưu dữ liệu...
              </Alert>
            )}

            <Button onClick={onBack} color="secondary">
              ⬅️ Quay lại
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
