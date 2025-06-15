import React, { useState, useEffect } from "react";
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Stack, MenuItem, Select, FormControl,
  InputLabel, LinearProgress, Button, IconButton, TextField
} from "@mui/material";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import vi from "date-fns/locale/vi";
import { getDocs, collection } from "firebase/firestore";
import { db } from "./firebase";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

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

function Row({ row, openGroups, setOpenGroups, summaryData }) {
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

export default function ThongKeTheoNgay({ onBack }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dataList, setDataList] = useState([]);
  const [summaryData, setSummaryData] = useState([]);
  const [openGroups, setOpenGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const snapshot = await getDocs(collection(db, "BANTRU"));
        const studentData = snapshot.docs.map(doc => doc.data());
        setDataList(studentData);
        setSummaryData(groupData(studentData));
      } catch (err) {
        console.error("❌ Lỗi khi tải dữ liệu từ Firebase:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 0, px: 1 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
        <Box sx={{ mb: 5 }}>
          <Typography
            variant="h5"
            fontWeight="bold"
            color="primary"
            align="center"
            sx={{ mb: 1 }}
          >
            TỔNG HỢP NGÀY
          </Typography>
          <Box sx={{ height: "1.5px", width: "100%", backgroundColor: "#1976d2", borderRadius: 1 }} />
        </Box>

        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
            <DatePicker
              label="Chọn ngày"
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              renderInput={(params) => <TextField {...params} size="small" />}
            />
          </Box>
        </LocalizationProvider>


        {isLoading && <LinearProgress />}

        <TableContainer component={Paper} sx={{ mt: 2, borderRadius: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: "bold", backgroundColor: "#1976d2", color: "white" }}>
                  LỚP / KHỐI
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", backgroundColor: "#1976d2", color: "white" }}>
                  SĨ SỐ
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", backgroundColor: "#1976d2", color: "white" }}>
                  ĂN BÁN TRÚ
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {summaryData.filter(row => row.isGroup).map((row, idx) => (
                <Row
                  key={idx}
                  row={row}
                  openGroups={openGroups}
                  setOpenGroups={setOpenGroups}
                  summaryData={summaryData}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Stack spacing={2} sx={{ mt: 4, alignItems: "center" }}>
          <Button onClick={onBack} color="secondary">
            ⬅️ Quay lại
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}