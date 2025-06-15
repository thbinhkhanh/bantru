import React, { useState } from "react";
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, LinearProgress, Stack, Alert,
  TextField, IconButton
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import vi from "date-fns/locale/vi";
import { db } from "./firebase";
import { getDocs, collection } from "firebase/firestore";

// Gộp và nhóm dữ liệu
function groupData(data) {
  const khoiData = {};
  let truongSiSo = 0;
  let truongAn = 0;

  data.forEach(item => {
    const lop = item.LỚP?.toString().trim();
    const khoi = lop?.split(".")[0];
    const huyDK = (item["HỦY ĐK"] || "").toUpperCase();

    if (!lop || !khoi) return;

    khoiData[khoi] = khoiData[khoi] || {
      group: `KHỐI ${khoi}`,
      siSo: 0,
      anBanTru: 0,
      isGroup: true,
      children: {},
    };

    khoiData[khoi].children[lop] = khoiData[khoi].children[lop] || {
      group: lop,
      siSo: 0,
      anBanTru: 0,
      isGroup: false,
    };

    if (huyDK !== "X") {
      khoiData[khoi].children[lop].siSo += 1;
      khoiData[khoi].siSo += 1;
      truongSiSo += 1;
    }

    if (huyDK === "T") {
      khoiData[khoi].children[lop].anBanTru += 1;
      khoiData[khoi].anBanTru += 1;
      truongAn += 1;
    }
  });

  const summaryData = [];
  const khoiList = Object.keys(khoiData).sort();

  for (const khoi of khoiList) {
    const khoiItem = khoiData[khoi];
    summaryData.push({
      group: khoiItem.group,
      siSo: khoiItem.siSo,
      anBanTru: khoiItem.anBanTru,
      isGroup: true,
    });

    const lopList = Object.keys(khoiItem.children).sort();
    for (const lop of lopList) {
      summaryData.push(khoiItem.children[lop]);
    }
  }

  summaryData.push({
    group: "TRƯỜNG",
    siSo: truongSiSo,
    anBanTru: truongAn,
    isGroup: true,
  });

  return summaryData;
}

// Dòng hiển thị khối hoặc lớp
function SummaryRow({ row, openGroups, setOpenGroups, summaryData }) {
  const isOpen = openGroups.includes(row.group);
  const isTruong = row.group === "TRƯỜNG";
  const isGroup = row.isGroup;

  const subRows = summaryData.filter(
    r => !r.isGroup && r.group.startsWith(row.group.split(" ")[1] + ".")
  );

  return (
    <>
      <TableRow
        sx={{
          backgroundColor: isTruong ? "#fff3e0" : "#e3f2fd",
          cursor: isGroup && !isTruong ? "pointer" : "default",
          "&:hover": { backgroundColor: isGroup && !isTruong ? "#bbdefb" : undefined },
        }}
        onClick={() => {
          if (isGroup && !isTruong) {
            setOpenGroups(isOpen ? openGroups.filter(g => g !== row.group) : [...openGroups, row.group]);
          }
        }}
      >
        <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
          {isGroup && !isTruong && (
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setOpenGroups(isOpen ? openGroups.filter(g => g !== row.group) : [...openGroups, row.group]);
              }}
            >
              {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          )}
          {row.group}
        </TableCell>
        <TableCell align="center" sx={{ fontWeight: "bold" }}>{row.siSo}</TableCell>
        <TableCell align="center" sx={{ fontWeight: "bold" }}>{row.anBanTru}</TableCell>
      </TableRow>

      {isGroup && isOpen &&
        subRows.map((subRow, i) => (
          <TableRow key={i} sx={{ backgroundColor: "#f9fbe7", "&:hover": { backgroundColor: "#f0f4c3" } }}>
            <TableCell sx={{ pl: 6, textAlign: "center" }}>{subRow.group}</TableCell>
            <TableCell align="center">{subRow.siSo}</TableCell>
            <TableCell align="center">{subRow.anBanTru}</TableCell>
          </TableRow>
        ))}
    </>
  );
}

export default function ChotSoLieu({ onBack }) {
  const [openGroups, setOpenGroups] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [summaryData, setSummaryData] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleUpdate = async () => {
    setIsLoading(true);
    setSummaryData([]);
    setShowSuccess(false);
    setOpenGroups([]); // Reset các khối đang mở

    try {
      const snapshot = await getDocs(collection(db, "BANTRU"));
      const allData = snapshot.docs.map(doc => doc.data());
      const summary = groupData(allData);
      setSummaryData(summary);
      setShowSuccess(true);
    } catch (err) {
      console.error("Lỗi Firestore:", err);
      alert("Không thể cập nhật dữ liệu từ Firestore!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 500, marginLeft: "auto", marginRight: "auto", paddingLeft: 0.5, paddingRight:0.5, mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h5" fontWeight="bold" color="primary" align="center">
          CHỐT SỐ LIỆU HỌC SINH
        </Typography>

        {/* Đường gạch dưới tiêu đề */}
        <Box
          sx={{
            height: "2px",
            width: "100%",
            backgroundColor: "#1976d2",
            borderRadius: 1,
            mt: 1,
            mb: 3,
          }}
        />


        <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" sx={{ mt: 3 }}>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
            <DatePicker
              label="Chọn ngày"
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              slotProps={{
                textField: {
                  size: "small",
                  sx: {
                    minWidth: 80,
                    maxWidth: 165,
                    "& input": {
                      textAlign: "center",
                    },
                  },
                },
              }}
            />

          </LocalizationProvider>

          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdate}
            disabled={isLoading}
            sx={{
              fontSize: {
                xs: "0.75rem", // 👈 trên điện thoại: nhỏ lại (~12px)
                sm: "1rem",    // 👈 từ máy tính trở lên: giữ nguyên (~16px)
              }
            }}
          >
            Cập nhật
          </Button>


        </Stack>

        {isLoading && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
            <LinearProgress sx={{ width: '50%', mb: 2 }} />
            <Typography variant="body2" color="textSecondary">
              Đang cập nhật dữ liệu...
            </Typography>
          </Box>
        )}

        {showSuccess && <Alert severity="success" sx={{ mt: 2 }}>✅ Dữ liệu đã được cập nhật!</Alert>}

        {summaryData.length > 0 && (
          <TableContainer component={Paper} sx={{ mt: 4, borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#1976d2' }}>
                  <TableCell align="center" sx={{ fontWeight: "bold", color: "white" }}>LỚP / KHỐI</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold", color: "white" }}>SĨ SỐ</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold", color: "white" }}>ĂN BÁN TRÚ</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {summaryData
                  .filter(row => row.isGroup)
                  .map((row, index) => (
                    <SummaryRow
                      key={index}
                      row={row}
                      openGroups={openGroups}
                      setOpenGroups={setOpenGroups}
                      summaryData={summaryData}
                    />
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Stack sx={{ mt: 3 }}>
          <Button onClick={onBack} color="secondary" fullWidth>
            ⬅️ Quay lại
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
