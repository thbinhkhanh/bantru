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
import { MySort } from './utils/MySort'; // 🆕
import * as XLSX from 'sheetjs-style';

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
        //setDataList(students);
        const sorted = MySort(students).map((s, idx) => ({ ...s, stt: idx + 1 })); // 🆕 Sắp xếp & cập nhật STT
        setDataList(sorted); // 🆕 Gán vào danh sách hiển thị
      } catch (err) {
        console.error("❌ Lỗi khi tải học sinh lớp:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, [selectedClass, selectedDate]);

  // Hàm xuất Excel

  const exportToExcelThongKe = (dataList, month, className, daySet) => {
    const title1 = 'TRƯỜNG TIỂU HỌC BÌNH KHÁNH';
    const title2 = `SỐ LIỆU BÁN TRÚ THÁNG ${month}`;
    const title3 = `LỚP: ${className}`;

    if (dataList.length === 0) return;

    const headerRow = ['STT', 'HỌ VÀ TÊN', ...daySet.map(d => `${d}`), 'TỔNG'];

    const dataRows = dataList.map((item, index) => {
      const row = [index + 1, item.hoVaTen];
      let total = 0;
      daySet.forEach(day => {
        const val = item.daySummary?.[day] === '✓' ? '✓' : '';
        if (val === '✓') total += 1;
        row.push(val);
      });
      row.push(total);
      return row;
    });

    const totalRow = ['TỔNG', ''];
    daySet.forEach(day => {
      const sum = dataList.reduce((acc, cur) => acc + (cur.daySummary?.[day] === '✓' ? 1 : 0), 0);
      totalRow.push(sum);
    });
    totalRow.push('');

    const finalData = [
      [title1],
      [title2],
      [title3],
      [],
      headerRow,
      ...dataRows,
      totalRow
    ];

    const ws = XLSX.utils.aoa_to_sheet(finalData);
    // Cài đặt độ rộng cột
      ws['!cols'] = [
        { wch: 5 },           // STT
        { wch: 27.5 },        // HỌ VÀ TÊN
        ...daySet.map(() => ({ wch: 5 })), // Các ngày
        { wch: 7 }            // TỔNG
      ];

    const totalCols = headerRow.length;

    // Merge dòng tiêu đề
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: totalCols - 1 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: totalCols - 1 } },
      { s: { r: 2, c: 0 }, e: { r: 2, c: totalCols - 1 } }
    ];

    ws['!merges'].push({ s: { r: finalData.length - 1, c: 0 }, e: { r: finalData.length - 1, c: 1 } });

    const range = XLSX.utils.decode_range(ws['!ref']);

    for (let R = 0; R <= range.e.r; ++R) {
      for (let C = 0; C <= range.e.c; ++C) {
        const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
        const cell = ws[cellRef];
        if (!cell) continue;

        // Dòng 0: Trường Tiểu học Bình Khánh
        if (R === 0) {
          cell.s = {
            font: { italic: true, color: { rgb: '2E74B5' }, sz: 12 },
            alignment: { horizontal: 'left', vertical: 'center' }
          };
        }

        // Dòng 1: Tiêu đề chính
        if (R === 1) {
          cell.s = {
            font: { bold: true, sz: 16, color: { rgb: '2E74B5' } },
            alignment: { horizontal: 'center', vertical: 'center' }
          };
        }

        // Dòng 2: Tiêu đề phụ
        if (R === 2) {
          cell.s = {
            font: { bold: true, sz: 14 },
            alignment: { horizontal: 'center', vertical: 'center' }
          };
        }

        // Dòng 4: Header
        if (R === 4) {
          cell.s = {
            font: { bold: true },
            fill: { fgColor: { rgb: 'EAF1FB' } },
            border: {
              top: { style: 'thin', color: { rgb: '000000' } },
              bottom: { style: 'thin', color: { rgb: '000000' } },
              left: { style: 'thin', color: { rgb: '000000' } },
              right: { style: 'thin', color: { rgb: '000000' } }
            },
            alignment: { horizontal: 'center', vertical: 'center' }
          };
        }

        // Dòng dữ liệu
        if (R >= 5 && R < range.e.r) {
          cell.s = {
            border: {
              top: { style: 'thin', color: { rgb: '999999' } },
              bottom: { style: 'thin', color: { rgb: '999999' } },
              left: { style: 'thin', color: { rgb: '999999' } },
              right: { style: 'thin', color: { rgb: '999999' } }
            },
            alignment: {
              horizontal: C === 1 ? 'left' : 'center',
              vertical: 'center'
            }
          };
        }

        // Dòng tổng cuối
        if (R === range.e.r) {
          cell.s = {
            font: { bold: true },
            border: {
              top: { style: 'thin', color: { rgb: '999999' } },
              bottom: { style: 'thin', color: { rgb: '999999' } },
              left: { style: 'thin', color: { rgb: '999999' } },
              right: { style: 'thin', color: { rgb: '999999' } }
            },
            alignment: { horizontal: 'center', vertical: 'center' }
          };
        }
      }
    }

    // Tạo và lưu file
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `Tháng ${month}`);
    XLSX.writeFile(wb, `ThongKe_Thang${month}_Lop${className}.xlsx`);
  };





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
          <Button
            variant="contained"
            onClick={() =>
              exportToExcelThongKe(dataList, selectedDate.getMonth() + 1, selectedClass, daySet)
            }
          >
            📥 Xuất Excel thống kê
          </Button>
    
          <Button onClick={onBack} color="secondary">⬅️ Quay lại</Button>
        </Stack>
      </Paper>
    </Box>
  );
}
