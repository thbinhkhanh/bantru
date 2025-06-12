import React, { useState } from 'react';
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
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const summaryData = [
  { group: '1.1', siSo: 14, anBanTru: 14 },
  { group: '1.2', siSo: 7, anBanTru: 7 },
  { group: '1.3', siSo: 13, anBanTru: 13 },
  { group: '1.4', siSo: 12, anBanTru: 12 },
  { group: '1.5', siSo: 8, anBanTru: 8 },
  { group: '1.6', siSo: 7, anBanTru: 7 },
  { group: 'KHỐI 1', siSo: 61, anBanTru: 61, isGroup: true },

  { group: '2.1', siSo: 11, anBanTru: 11 },
  { group: '2.2', siSo: 12, anBanTru: 12 },
  { group: '2.3', siSo: 6, anBanTru: 6 },
  { group: '2.4', siSo: 4, anBanTru: 4 },
  { group: '2.5', siSo: 3, anBanTru: 3 },
  { group: '2.6', siSo: 4, anBanTru: 4 },
  { group: 'KHỐI 2', siSo: 40, anBanTru: 40, isGroup: true },

  { group: '3.1', siSo: 5, anBanTru: 5 },
  { group: '3.2', siSo: 11, anBanTru: 11 },
  { group: '3.3', siSo: 10, anBanTru: 10 },
  { group: '3.4', siSo: 4, anBanTru: 4 },
  { group: '3.5', siSo: 5, anBanTru: 5 },
  { group: '3.6', siSo: 10, anBanTru: 10 },
  { group: 'KHỐI 3', siSo: 45, anBanTru: 45, isGroup: true },

  { group: '4.1', siSo: 5, anBanTru: 5 },
  { group: '4.2', siSo: 14, anBanTru: 14 },
  { group: '4.3', siSo: 14, anBanTru: 14 },
  { group: '4.4', siSo: 4, anBanTru: 4 },
  { group: '4.5', siSo: 5, anBanTru: 5 },
  { group: '4.6', siSo: 10, anBanTru: 10 },
  { group: 'KHỐI 4', siSo: 52, anBanTru: 52, isGroup: true },

  { group: '5.1', siSo: 10, anBanTru: 10 },
  { group: '5.2', siSo: 8, anBanTru: 8 },
  { group: '5.3', siSo: 7, anBanTru: 7 },
  { group: '5.4', siSo: 6, anBanTru: 6 },
  { group: '5.5', siSo: 6, anBanTru: 6 },
  { group: '5.6', siSo: 0, anBanTru: 0 },
  { group: 'KHỐI 5', siSo: 37, anBanTru: 37, isGroup: true },

  { group: 'TRƯỜNG', siSo: 235, anBanTru: 235, isGroup: true },
];

function Row({ row, openGroups, setOpenGroups }) {
  const isOpen = openGroups.includes(row.group);
  const groupNumber = row.group.split(' ')[1];
  const isTruong = row.group === 'TRƯỜNG';
  const subRows = summaryData.filter((r) => !r.isGroup && r.group.startsWith(groupNumber + '.'));

  return (
    <>
      <TableRow
        sx={{
          backgroundColor: isTruong ? '#fff3e0' : '#e3f2fd',
          cursor: isTruong ? 'default' : 'pointer',
          '&:hover': { backgroundColor: isTruong ? '#ffe0b2' : '#bbdefb' },
        }}
        onClick={() => {
          if (!isTruong) {
            setOpenGroups(isOpen ? openGroups.filter(g => g !== row.group) : [...openGroups, row.group]);
          }
        }}
      >
        <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          {!isTruong && (
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
        <TableCell align="center" sx={{ fontWeight: 'bold' }}>{row.siSo}</TableCell>
        <TableCell align="center" sx={{ fontWeight: 'bold' }}>{row.anBanTru}</TableCell>
      </TableRow>

      {isOpen && subRows.map((subRow, i) => (
        <TableRow key={i} sx={{ backgroundColor: '#f9fbe7', '&:hover': { backgroundColor: '#f0f4c3' } }}>
          <TableCell sx={{ pl: 6, textAlign: 'center' }}>{subRow.group}</TableCell>
          <TableCell align="center">{subRow.siSo}</TableCell>
          <TableCell align="center">{subRow.anBanTru}</TableCell>
        </TableRow>
      ))}
    </>
  );
}

export default function ChotSoLieu() {
  const [openGroups, setOpenGroups] = useState([]);
  const today = new Date().toLocaleDateString('vi-VN');

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', mt: 4, p: 3 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          fontWeight="bold"
          color="primary"
        >
          SỐ LIỆU TRONG NGÀY
        </Typography>

        <Typography
          align="center"
          sx={{ mt: 2, mb: 4, color: 'error.main', fontWeight: 'bold', fontSize: '1.1rem' }}
        >
          {today}
        </Typography>

        <TableContainer component={Paper} sx={{ mt: 2, borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>LỚP / KHỐI</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>SĨ SỐ</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>ĂN BÁN TRÚ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {summaryData
                .filter(row => row.isGroup || row.group === 'TRƯỜNG')
                .map((row, index) => (
                  <Row key={index} row={row} openGroups={openGroups} setOpenGroups={setOpenGroups} />
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
