import React, { useState, useEffect } from "react";
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Stack, MenuItem, Select,
  FormControl, InputLabel, LinearProgress, Button
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import vi from "date-fns/locale/vi";
import { getDoc, getDocs, doc, collection, query, where } from "firebase/firestore";
import { db } from "./firebase";

export default function ThongKeNam({ onBack }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedClass, setSelectedClass] = useState("");
  const [classList, setClassList] = useState([]);
  const [dataList, setDataList] = useState([]);
  const [monthSet, setMonthSet] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showMonths, setShowMonths] = useState(false);

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
          const monthSummary = {};
          let total = 0;

          Object.entries(data).forEach(([dateStr, val]) => {
            const date = new Date(dateStr);
            if (!isNaN(date) && date.getFullYear() === selectedDate.getFullYear()) {
              const month = date.getMonth() + 1;
              monthSummary[month] = (monthSummary[month] || 0) + (val === "T" ? 1 : 0);
              total += val === "T" ? 1 : 0;
            }
          });

          return {
            id: docSnap.id,
            hoVaTen: d.hoVaTen,
            stt: index + 1,
            monthSummary,
            total,
            huyDangKy: d.huyDangKy || "",
          };
        });

        const allMonths = new Set();
        students.forEach((s) => {
          Object.keys(s.monthSummary).forEach((m) => allMonths.add(parseInt(m)));
        });

        const months = Array.from(allMonths).sort((a, b) => a - b);
        setMonthSet(months);
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
            TỔNG HỢP CẢ NĂM
          </Typography>
          <Box sx={{ height: "2px", width: "100%", backgroundColor: "#1976d2", borderRadius: 1, mt: 2, mb: 4 }} />
        </Box>

        <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" flexWrap="wrap" sx={{ mb: 4 }}>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
            <DatePicker
              label="Chọn năm"
              views={["year"]}
              openTo="year"
              value={selectedDate}
              onChange={(newValue) => {
                if (newValue instanceof Date && !isNaN(newValue)) {
                  setSelectedDate(newValue);
                }
              }}
              slotProps={{
                textField: {
                  size: "small",
                  sx: {
                    minWidth: 100,
                    maxWidth: 145,
                    "& input": { textAlign: "center" },
                  },
                },
              }}
            />
          </LocalizationProvider>

          <FormControl size="small" sx={{ minWidth: 80, maxWidth: 100 }}>
            <InputLabel>Lớp</InputLabel>
            <Select value={selectedClass} label="Lớp" onChange={(e) => setSelectedClass(e.target.value)}>
              {classList.map((cls, idx) => (
                <MenuItem key={idx} value={cls}>{cls}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button variant="outlined" onClick={() => setShowMonths(prev => !prev)}>
            {showMonths ? "ẨN THÁNG" : "HIỆN THÁNG"}
          </Button>
        </Stack>

        {isLoading && (
          <Box sx={{ width: "50%", mx: "auto", my: 2 }}>
            <LinearProgress />
          </Box>
        )}

        <Box sx={{ width: "100%", overflowX: "auto", mt: 2 }}>
          <TableContainer component={Paper} sx={{ borderRadius: 2, minWidth: "max-content" }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={{ fontWeight: "bold", backgroundColor: "#1976d2", color: "white" }}>STT</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold", backgroundColor: "#1976d2", color: "white" }}>HỌ VÀ TÊN</TableCell>
                  {showMonths && monthSet.map((m) => (
                    <TableCell key={m} align="center" sx={{ fontWeight: "bold", backgroundColor: "#1976d2", color: "white" }}>
                      Tháng {m}
                    </TableCell>
                  ))}
                  <TableCell align="center" sx={{ fontWeight: "bold", backgroundColor: "#1976d2", color: "white" }}>TỔNG CỘNG</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataList.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell align="center">{student.stt}</TableCell>
                    <TableCell>{student.hoVaTen}</TableCell>
                    {showMonths && monthSet.map((m) => (
                      <TableCell key={m} align="center">{student.monthSummary[m] > 0 ? student.monthSummary[m] : ""}</TableCell>
                    ))}
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>{student.total > 0 ? student.total : ""}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Stack sx={{ mt: 4 }}>
          <Button onClick={onBack} color="secondary">⬅️ Quay lại</Button>
        </Stack>
      </Paper>
    </Box>
  );
}