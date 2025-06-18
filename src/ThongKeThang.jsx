import React, { useState, useEffect } from "react";
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Stack, MenuItem,
  Select, FormControl, InputLabel, LinearProgress, Button
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import vi from "date-fns/locale/vi";
import { getDoc, getDocs, doc, collection, query, where } from "firebase/firestore";
import { db } from "./firebase";

export default function ThongKeThang({ onBack }) {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [selectedClass, setSelectedClass] = useState("");
  const [classList, setClassList] = useState([]);
  const [dataList, setDataList] = useState([]);
  const [daySet, setDaySet] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDays, setShowDays] = useState(false);

  useEffect(() => {
    const fetchClassList = async () => {
      try {
        const docRef = doc(db, "DANHSACH", "TRUONG");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const list = docSnap.data().list || [];
          setClassList(list);
          if (list.length > 0) setSelectedClass(list[0]);
        }
      } catch (err) {
        console.error("❌ Lỗi khi tải danh sách lớp:", err);
      }
    };
    fetchClassList();
  }, []);

  useEffect(() => {
    if (!selectedClass || !selectedDate) return;

    const fetchStudents = async () => {
      setIsLoading(true);
      try {
        const q = query(collection(db, "BANTRU"), where("lop", "==", selectedClass));
        const snapshot = await getDocs(q);
        const students = snapshot.docs.map((docSnap, index) => {
          const d = docSnap.data();
          const data = d.data || {};
          const huyDangKy = d.huyDangKy || "";
          const daySummary = {};
          let total = 0;

          Object.entries(data).forEach(([dateStr, val]) => {
            const date = new Date(dateStr);
            if (!isNaN(date) && date.getMonth() === selectedDate.getMonth() && date.getFullYear() === selectedDate.getFullYear()) {
              const day = date.getDate();
              daySummary[day] = val === "T" ? "✓" : "";
              if (val === "T") total += 1;
            }
          });

          return {
            id: docSnap.id,
            hoVaTen: d.hoVaTen,
            stt: index + 1,
            daySummary,
            total,
            huyDangKy,
          };
        });

        const allDays = new Set();
        students.forEach((s) => {
          Object.keys(s.daySummary).forEach((d) => allDays.add(parseInt(d)));
        });

        const days = Array.from(allDays).sort((a, b) => a - b);
        setDaySet(days);
        setDataList(students);
      } catch (err) {
        console.error("❌ Lỗi khi tải học sinh lớp:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, [selectedClass, selectedDate]);

  return (
    <Box sx={{ width: "100%", overflowX: "auto", mt: 0, px: 1 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4, width: "max-content", mx: "auto" }}>
        <Box sx={{ mb: 5 }}>
          <Typography variant="h5" fontWeight="bold" color="primary" align="center" sx={{ mb: 1 }}>
            SỐ LIỆU THÁNG
          </Typography>
          <Box sx={{ height: "2.5px", width: "100%", backgroundColor: "#1976d2", borderRadius: 1, mt: 2, mb: 4 }} />
        </Box>

        <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" flexWrap="wrap" sx={{ mb: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
            <DatePicker
              label="Chọn tháng"
              views={["month"]}
              openTo="month"
              value={selectedDate}
              onChange={(newValue) => {
                if (newValue instanceof Date && !isNaN(newValue)) {
                  setSelectedDate(new Date(newValue.getFullYear(), newValue.getMonth(), 1));
                }
              }}
              slotProps={{
                textField: {
                  size: "small",
                  sx: {
                    minWidth: 100,
                    maxWidth: 160,
                    "& input": { textAlign: "center" },
                  },
                },
              }}
            />
          </LocalizationProvider>

          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel>Lớp</InputLabel>
            <Select
              value={selectedClass}
              label="Lớp"
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              {classList.map((cls, idx) => (
                <MenuItem key={idx} value={cls}>{cls}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button variant="outlined" onClick={() => setShowDays(!showDays)}>
            {showDays ? "Ẩn ngày" : "Hiện ngày"}
          </Button>
        </Stack>

        {isLoading && <LinearProgress sx={{ width: "50%", mx: "auto", my: 2 }} />}

        <TableContainer component={Paper} sx={{ borderRadius: 2, mt: 2 }}>
          <Table size="small" sx={{ borderCollapse: "collapse" }}>
            <TableHead>
              <TableRow sx={{ height: 48 }}>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "#1976d2",
                    color: "white",
                    px: 1,
                    border: "1px solid #ccc"
                  }}
                >
                  STT
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "#1976d2",
                    color: "white",
                    minWidth: 140,
                    px: 1,
                    border: "1px solid #ccc"
                  }}
                >
                  HỌ VÀ TÊN
                </TableCell>
                {showDays &&
                  daySet.map((d) => {
                    const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), d);
                    const isWeekend = date.getDay() === 6 || date.getDay() === 0;
                    return (
                      <TableCell
                        key={d}
                        align="center"
                        sx={{
                          fontWeight: "bold",
                          backgroundColor: isWeekend ? "#d32f2f" : "#1976d2",
                          color: "white",
                          minWidth: 40,
                          px: 1,
                          border: "1px solid #ccc"
                        }}
                      >
                        {d}
                      </TableCell>
                    );
                  })}
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "#1976d2",
                    color: "white",
                    minWidth: 70,
                    px: 1,
                    border: "1px solid #ccc"
                  }}
                >
                  TỔNG CỘNG
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {dataList.map((student) => (
                <TableRow
                  key={student.id}
                  sx={{
                    height: 48,
                    backgroundColor: student.huyDangKy?.toLowerCase() === "x" ? "#f0f0f0" : "inherit",
                  }}
                >
                  <TableCell align="center" sx={{ width: 48, px: 1, border: "1px solid #ccc" }}>
                    {student.stt}
                  </TableCell>
                  <TableCell sx={{ px: 1, border: "1px solid #ccc" }}>
                    {student.hoVaTen}
                  </TableCell>
                  {showDays &&
                    daySet.map((d) => (
                      <TableCell
                        key={d}
                        align="center"
                        sx={{
                          color: student.daySummary[d] ? "#1976d2" : "inherit",
                          px: 1,
                          border: "1px solid #ccc"
                        }}
                      >
                        {student.daySummary[d] || ""}
                      </TableCell>
                    ))}
                  <TableCell align="center" sx={{ fontWeight: "bold", px: 1, border: "1px solid #ccc" }}>
                    {student.total > 0 ? student.total : ""}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

        </TableContainer>

        <Stack spacing={2} sx={{ mt: 4, alignItems: "center" }}>
          <Button onClick={onBack} color="secondary">⬅️ Quay lại</Button>
        </Stack>
      </Paper>
    </Box>
  );
}
