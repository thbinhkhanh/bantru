import React, { useState, useEffect } from "react";
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Stack, MenuItem,
  Select, FormControl, InputLabel, LinearProgress, Button, useTheme, useMediaQuery
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import vi from "date-fns/locale/vi";
import { getDoc, getDocs, doc, collection, query, where } from "firebase/firestore";
import { db } from "./firebase";
import { MySort } from "./utils/MySort";
import { exportThongKeNamToExcel } from "./utils/exportThongKeNamToExcel";

export default function ThongKeNam({ onBack }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedClass, setSelectedClass] = useState("");
  const [classList, setClassList] = useState([]);
  const [dataList, setDataList] = useState([]);
  const [monthSet, setMonthSet] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showMonths, setShowMonths] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Lấy danh sách lớp
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

  // Khi thay đổi lớp hoặc năm, tải dữ liệu
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

        // Luôn hiển thị 12 tháng
        const months = Array.from({ length: 12 }, (_, i) => i + 1);
        setMonthSet(months);

        const sorted = MySort(students).map((s, idx) => ({ ...s, stt: idx + 1 }));
        setDataList(sorted);
      } catch (err) {
        console.error("❌ Lỗi khi tải học sinh lớp:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, [selectedClass, selectedDate]);

  const headCellStyle = {
    fontWeight: "bold",
    backgroundColor: "#E3F2FD",
    border: "1px solid #ccc",
    whiteSpace: "nowrap",
    textAlign: "center",
  };

  // Hàm gọi export: lấy năm từ selectedDate
  const handleExport = () => {
    exportThongKeNamToExcel(dataList, selectedDate.getFullYear(), selectedClass, monthSet);
  };

  return (
    <Box sx={{ width: "100%", overflowX: "auto", mt: 0, px: 1 }}>
      <Paper elevation={3} sx={{
        p: 4,
        borderRadius: showMonths ? 0 : 4,
        mx: "auto",
        overflowX: "auto",
        ...(showMonths
          ? {
              position: "fixed",
              top: 0, left: 0, right: 0, bottom: 0,
              zIndex: 1300, backgroundColor: "white", overflow: "auto"
            }
          : {
              width: "max-content"
            }),
      }}>
        {/* Tiêu đề và gạch xanh */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h5" fontWeight="bold" color="primary" align="center" sx={{ mb: 1 }}>
            TỔNG HỢP CẢ NĂM
          </Typography>
          <Box sx={{ height: "2.5px", width: "100%", backgroundColor: "#1976d2", borderRadius: 1, mt: 2, mb: 4 }} />
        </Box>

        {/* Bộ chọn năm, lớp, ẩn/hiện tháng, Xuất Excel luôn hiển thị */}
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
                    minWidth: 100, maxWidth: 145,
                    "& input": { textAlign: "center" }
                  }
                }
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

          {/* Luôn hiển thị Export, desktop và mobile */}
          <Button
            variant="contained"
            color="success"
            onClick={handleExport}
            sx={{
              // Trên mobile có thể chiếm full width hoặc co lại tuỳ ý:
              ...(isMobile
                ? { width: '100%', maxWidth: 200 }
                : {}
              )
            }}
          >
            📅 Xuất Excel
          </Button>
        </Stack>

        {isLoading && (
          <Box sx={{ width: "50%", mx: "auto", my: 2 }}>
            <LinearProgress />
          </Box>
        )}

        <Box sx={{ width: "100%", overflowX: "auto", mt: 2 }}>
          <TableContainer component={Paper} sx={{ borderRadius: 2, minWidth: "max-content" }}>
            <Table size="small" sx={{ borderCollapse: "collapse" }}>
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={{ ...headCellStyle, width: 48, position: "sticky", left: 0, zIndex: 2 }}>STT</TableCell>
                  <TableCell align="center" sx={{ ...headCellStyle, minWidth: 180, position: "sticky", left: 48, zIndex: 2 }}>HỌ VÀ TÊN</TableCell>
                  {showMonths && monthSet.map((m) => (
                    <TableCell key={m} align="center" sx={{ ...headCellStyle, minWidth: 30, px: 0.5 }}>
                      Tháng {m}
                    </TableCell>
                  ))}
                  <TableCell align="center" sx={{ ...headCellStyle, width: 80 }}>TỔNG CỘNG</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataList.map((student) => (
                  <TableRow key={student.id} sx={{
                    height: 44,
                    backgroundColor: student.huyDangKy?.toLowerCase() === "x" ? "#f0f0f0" : "inherit",
                    "& td": { border: "1px solid #ccc", py: 1 }
                  }}>
                    <TableCell align="center" sx={{ width: 48, px: 1, position: "sticky", left: 0, backgroundColor: "#fff", zIndex: 1 }}>
                      {student.stt}
                    </TableCell>
                    <TableCell sx={{ minWidth: 180, px: 1, position: "sticky", left: 48, backgroundColor: "#fff", zIndex: 1 }}>
                      {student.hoVaTen}
                    </TableCell>
                    {showMonths && monthSet.map((m) => (
                      <TableCell key={m} align="center" sx={{ minWidth: 30, px: 0.5 }}>
                        {student.monthSummary[m] > 0 ? student.monthSummary[m] : ""}
                      </TableCell>
                    ))}
                    <TableCell align="center" sx={{ width: 80, px: 1 }}>
                      {student.total > 0 ? student.total : ""}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Trên mobile có thể để xuất Excel ở cuối nữa, nhưng đã hiển thị ở trên */}
        {/* Nếu muốn thêm ở cuối, có thể bật: */}
        {/* 
        {isMobile && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Button variant="contained" color="success" onClick={handleExport} fullWidth>
              📅 Xuất Excel
            </Button>
          </Box>
        )} 
        */}

        <Stack spacing={2} sx={{ mt: 4, alignItems: "center" }}>
          <Button onClick={onBack} color="secondary">
            ⬅️ Quay lại
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
