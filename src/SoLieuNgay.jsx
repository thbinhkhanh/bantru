import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  LinearProgress,
  Stack,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

// Hàm gom nhóm dữ liệu theo mẫu
function groupData(data) {
  const khoiData = {};
  let truongSiSo = 0;
  let truongAn = 0;

  data.forEach(item => {
    const lop = item.lop?.toString().trim();
    const khoi = lop?.split(".")[0];
    const huyDK = (item.huyDangKy || "").toUpperCase();

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

// Component hiển thị từng dòng dữ liệu
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

// Component chính
export default function SoLieuTrongNgay({ onBack }) {
  const [openGroups, setOpenGroups] = useState([]);
  const [summaryData, setSummaryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const today = new Date().toLocaleDateString("vi-VN");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await getDocs(collection(db, "BANTRU"));
        const allData = snapshot.docs.map(doc => doc.data());
        const summary = groupData(allData);
        setSummaryData(summary);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu Firestore:", error);
        alert("Không thể tải dữ liệu từ Firestore!");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Box
      sx={{
        maxWidth: { xs: '100%', sm: 500 },
        mx: 'auto',
        px: { xs: 0.5, sm: 2 },
        mt: 0,
      }}
    >
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4, mt:2 }}>
        <Typography variant="h5" fontWeight="bold" color="primary" align="center">
          SỐ LIỆU TRONG NGÀY
        </Typography>

        <Typography
          align="center"
          sx={{
            mt: 2,
            mb: 4,
            color: "error.main",
            fontWeight: "bold",
            fontSize: "1.1rem",
          }}
        >
          <Box sx={{ height: "2px", width: "100%", backgroundColor: "#1976d2", borderRadius: 1, mt: 1, mb: 3 }} />
          {today}
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
            <LinearProgress sx={{ width: '50%', mb: 2 }} />
            <Typography variant="body2" color="textSecondary">
              Đang tải số liệu...
            </Typography>
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ mt: 2, borderRadius: 2 }}>
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
                    <Row
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