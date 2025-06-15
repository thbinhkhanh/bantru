import React, { useState, useEffect } from "react";
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Stack, MenuItem,
  Select, FormControl, InputLabel, LinearProgress, Button, Checkbox
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import vi from "date-fns/locale/vi";
import { getDocs, collection } from "firebase/firestore";
import { db } from "./firebase";

export default function ThongKeNam({ onBack }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedClass, setSelectedClass] = useState("");
  const [classList, setClassList] = useState([]);
  const [dataList, setDataList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const snapshot = await getDocs(collection(db, "BANTRU"));
        const studentData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            registered: data["HỦY ĐK"] === "T"
          };
        });

        setDataList(studentData);
        const classes = [...new Set(studentData.map(s => s.LỚP))].sort();
        setClassList(classes);
        if (classes.length > 0) setSelectedClass(classes[0]);
      } catch (err) {
        console.error("❌ Lỗi khi tải dữ liệu từ Firebase:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleClassChange = (event) => {
    setSelectedClass(event.target.value);
  };

  const toggleRegister = (id) => {
    const updated = dataList.map(student =>
      student.id === id
        ? { ...student, registered: !student.registered }
        : student
    );
    setDataList(updated);
  };

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
            TỔNG HỢP CẢ NĂM
          </Typography>
          <Box sx={{ height: "1.5px", width: "100%", backgroundColor: "#1976d2", borderRadius: 1 }} />
        </Box>

        {/* 🔹 Chọn năm và lớp */}
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="center"
            flexWrap="wrap"
            sx={{ mb: 4 }}
          >

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
                    "& input": {
                      textAlign: "center",
                    },
                  },
                },
              }}
            />
          </LocalizationProvider>

          <FormControl size="small" sx={{ minWidth: 80 }}>
            <InputLabel>Lớp</InputLabel>
            <Select value={selectedClass} label="Lớp" onChange={handleClassChange}>
              {classList.map((cls, idx) => (
                <MenuItem key={idx} value={cls}>{cls}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        {isLoading && <LinearProgress />}

        {/* 🔹 Hiển thị bảng học sinh */}
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 2,
            mt: 2,
            ml: { xs: -1, sm: 0 },
            mr: { xs: -1, sm: 0 },
            width: { xs: "calc(100% + 16px)", sm: "100%" },
          }}
        >
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "#1976d2",
                    color: "white",
                    width: 40,
                    py: 0.5,
                    px: 1,
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
                    py: 0.5,
                    px: 1,
                  }}
                >
                  HỌ VÀ TÊN
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "#1976d2",
                    color: "white",
                    py: 0.5,
                    px: 1,
                  }}
                >
                  ĂN BÁN TRÚ
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {dataList
                .filter((s) => s.LỚP === selectedClass)
                .map((student, index) => (
                  <TableRow key={student.id} hover sx={{ height: 48 }}>
                    <TableCell align="center" sx={{ py: 0.5, px: 1 }}>
                      {index + 1}
                    </TableCell>
                    <TableCell sx={{ py: 0.5, px: 1 }}>
                      {student["HỌ VÀ TÊN"]}
                    </TableCell>
                    <TableCell align="center" sx={{ py: 0.5, px: 1 }}>
                      {/* 👉 Thay thế bằng giá trị thực nếu có, ví dụ: */}
                      {/* {student.total || 0} */}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>

          </Table>
        </TableContainer>

        {/* 🔹 Nút quay lại */}
        <Stack spacing={2} sx={{ mt: 4, alignItems: "center" }}>
          <Button onClick={onBack} color="secondary">
            ⬅️ Quay lại
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
