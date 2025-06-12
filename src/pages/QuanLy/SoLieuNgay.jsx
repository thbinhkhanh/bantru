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
  TextField,
  Button,
  LinearProgress,
  Stack,
  Alert,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import vi from 'date-fns/locale/vi';

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
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleUpdate = () => {
    setIsLoading(true);
    setIsUpdated(false);
    setShowSuccess(false);
    setTimeout(() => {
      setIsLoading(false);
      setIsUpdated(true);
      setShowSuccess(true);
    }, 2000);
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          fontWeight="bold"
          color="primary"
          sx={{ mb: 5 }}
        >
          SỐ LIỆU TRONG NGÀY 2
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="center">
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
            <DatePicker
              label="Chọn ngày"
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              renderInput={(params) => <TextField {...params} size="small" />}
            />
          </LocalizationProvider>

          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdate}
            disabled={isLoading}
            sx={{ minWidth: 140 }}
          >
            Cập nhật
          </Button>
        </Stack>

        {isLoading && (
          <Box sx={{ width: '100%', mt: 3 }}>
            <LinearProgress />
            <Typography align="center" mt={1}>Đang cập nhật dữ liệu...</Typography>
          </Box>
        )}

        {showSuccess && (
          <>
            <Alert severity="success" sx={{ mt: 3, textAlign: 'center' }}>
              Cập nhật dữ liệu thành công!
            </Alert>

            <Typography
              align="center"
              sx={{ mt: 4, color: 'error.main', fontWeight: 'bold' }}
            >
              Dữ liệu cập nhật đến ngày: {selectedDate.toLocaleDateString('vi-VN')}
            </Typography>
          </>
        )}


        {isUpdated && (
          <TableContainer component={Paper} sx={{ mt: 4, borderRadius: 2 }}>
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
        )}
      </Paper>
    </Box>
  );
}
