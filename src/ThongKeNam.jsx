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
import * as XLSX from 'sheetjs-style';

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

  const exportToExcel = (dataList, selectedYear, selectedClass, monthSet) => {
    const title1 = 'TRƯỜNG TIỂU HỌC BÌNH KHÁNH';
    const title2 = `THỐNG KÊ BÁN TRÚ NĂM ${selectedYear}`;
    const title3 = `LỚP: ${selectedClass}`;

    if (!dataList || dataList.length === 0) return;

    const headerRow = ['STT', 'HỌ VÀ TÊN', ...monthSet.map(m => `Tháng ${m}`), 'TỔNG'];

    const dataRows = dataList.map((item, index) => {
      const row = [index + 1, item.hoVaTen];
      let total = 0;
      monthSet.forEach(month => {
        const val = item.monthSummary?.[month] || 0;
        row.push(val);
        total += val;
      });
      row.push(total);
      return row;
    });

    const totalRow = ['TỔNG', ''];
    monthSet.forEach(month => {
      const sum = dataList.reduce((acc, cur) => acc + (cur.monthSummary?.[month] || 0), 0);
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

    ws['!cols'] = [
      { wch: 5 },
      { wch: 27.5 },
      ...monthSet.map(() => ({ wch: 7 })),
      { wch: 8 }
    ];

    const totalCols = headerRow.length;
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: totalCols - 1 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: totalCols - 1 } },
      { s: { r: 2, c: 0 }, e: { r: 2, c: totalCols - 1 } },
      { s: { r: finalData.length - 1, c: 0 }, e: { r: finalData.length - 1, c: 1 } }
    ];

    const range = XLSX.utils.decode_range(ws['!ref']);
    for (let R = 0; R <= range.e.r; ++R) {
      for (let C = 0; C <= range.e.c; ++C) {
        const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
        const cell = ws[cellRef];
        if (!cell) continue;

        if (R === 0) {
          cell.s = {
            font: { italic: true, color: { rgb: '2E74B5' }, sz: 12 },
            alignment: { horizontal: 'left', vertical: 'center' }
          };
        } else if (R === 1) {
          cell.s = {
            font: { bold: true, sz: 16, color: { rgb: '2E74B5' } },
            alignment: { horizontal: 'center', vertical: 'center' }
          };
        } else if (R === 2) {
          cell.s = {
            font: { bold: true, sz: 14 },
            alignment: { horizontal: 'center', vertical: 'center' }
          };
        } else if (R === 4) {
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
        } else if (R >= 5 && R < range.e.r) {
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
        } else if (R === range.e.r) {
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

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `Năm ${selectedYear}`);
    XLSX.writeFile(wb, `ThongKe_Nam${selectedYear}_Lop${selectedClass}.xlsx`);
  };

  const headCellStyle = {
    fontWeight: "bold",
    backgroundColor: "#E3F2FD",
    border: "1px solid #ccc",
    whiteSpace: "nowrap",
    textAlign: "center",
  };
  
  return (
  <Box sx={{ width: "100%", overflowX: "auto", mt: 0, px: 1 }}>
    <Paper elevation={3} sx={{ p: 4, borderRadius: 4, width: "max-content", mx: "auto" }}>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h5" fontWeight="bold" color="primary" align="center" sx={{ mb: 1 }}>
          TỔNG HỢP CẢ NĂM
        </Typography>
        <Box sx={{ height: "2.5px", width: "100%", backgroundColor: "#1976d2", borderRadius: 1, mt: 2, mb: 4 }} />
      </Box>

      {/* Bộ chọn năm, lớp, ẩn/hiện tháng, xuất Excel */}
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

        <Button variant="outlined" onClick={() => setShowMonths(prev => !prev)}>
          {showMonths ? "ẨN THÁNG" : "HIỆN THÁNG"}
        </Button>

        {/* ✅ Nút xuất Excel trên đầu chỉ khi là máy tính */}
        {!isMobile && (
          <Button
            variant="contained"
            color="success"
            onClick={() =>
              exportToExcel(dataList, selectedDate.getFullYear(), selectedClass, monthSet)
            }
          >
            📥 Xuất Excel
          </Button>
        )}
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
                <TableCell align="center" sx={headCellStyle}>STT</TableCell>
                <TableCell align="center" sx={headCellStyle}>HỌ VÀ TÊN</TableCell>
                {showMonths && monthSet.map((m) => (
                  <TableCell key={m} align="center" sx={headCellStyle}>
                    Tháng {m}
                  </TableCell>
                ))}
                <TableCell align="center" sx={headCellStyle}>TỔNG CỘNG</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataList.map((student) => (
                <TableRow
                  key={student.id}
                  sx={{
                    height: 44,
                    backgroundColor: student.huyDangKy?.toLowerCase() === "x" ? "#f0f0f0" : "inherit",
                    "& td": { border: "1px solid #ccc", py: 1 },
                  }}
                >
                  <TableCell align="center" sx={{ px: 1 }}>{student.stt}</TableCell>
                  <TableCell sx={{ width: 200, whiteSpace: "nowrap", px: 1 }}>{student.hoVaTen}</TableCell>
                  {showMonths && monthSet.map((m) => (
                    <TableCell key={m} align="center" sx={{ width: 80, px: 1 }}>
                      {student.monthSummary[m] > 0 ? student.monthSummary[m] : ""}
                    </TableCell>
                  ))}
                  <TableCell align="center" sx={{ width: 100, px: 1 }}>
                    {student.total > 0 ? student.total : ""}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* ✅ Nút Xuất Excel ở cuối nếu là điện thoại */}
      {isMobile && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Button
            variant="contained"
            color="success"
            onClick={() =>
              exportToExcel(dataList, selectedDate.getFullYear(), selectedClass, monthSet)
            }
          >
            📥 Xuất Excel
          </Button>
        </Box>
      )}

      {/* Nút quay lại */}
      <Stack spacing={2} sx={{ mt: 4, alignItems: "center" }}>
        <Button onClick={onBack} color="secondary">
          ⬅️ Quay lại
        </Button>
      </Stack>
    </Paper>
  </Box>
);
}