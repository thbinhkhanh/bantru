import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  LinearProgress,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export default function FormBanTru({ onBack }) {
  const [classList, setClassList] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [allStudents, setAllStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedStudentData, setSelectedStudentData] = useState(null);
  const [dangKy, setDangKy] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [nhapTuDanhSach, setNhapTuDanhSach] = useState("danhSach");

  const [customHoTen, setCustomHoTen] = useState("");
  const [customMaDinhDanh, setCustomMaDinhDanh] = useState("");

  const dangKyOptions = ["Đăng ký mới", "Hủy đăng ký", "Đăng ký lại"];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const snapshot = await getDocs(collection(db, "BANTRU"));
        const studentsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAllStudents(studentsData);

        const classes = Array.from(new Set(studentsData.map((s) => s.LỚP))).sort();
        setClassList(classes);
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!selectedClass) {
      setFilteredStudents([]);
      setSelectedStudentId("");
      setSelectedStudentData(null);
      setDangKy("");
      return;
    }
    const filtered = allStudents.filter((s) => s.LỚP === selectedClass);
    setFilteredStudents(filtered);
    setSelectedStudentId("");
    setSelectedStudentData(null);
    setDangKy("");
  }, [selectedClass, allStudents]);

  useEffect(() => {
    if (!selectedStudentId || nhapTuDanhSach !== "danhSach") {
      setSelectedStudentData(null);
      setDangKy("");
      return;
    }
    const student = filteredStudents.find((s) => s.id === selectedStudentId);
    setSelectedStudentData(student || null);
    setDangKy(student?.["ĐĂNG KÝ"] || "");
  }, [selectedStudentId, filteredStudents, nhapTuDanhSach]);

  const handleUpdate = async () => {
    setSaving(true);
    try {
      if (nhapTuDanhSach === "danhSach") {
        if (!selectedStudentData) {
          alert("Vui lòng chọn học sinh");
          return;
        }
        console.log("🔁 Cập nhật học sinh từ danh sách:", {
          id: selectedStudentData.id,
          dangKy,
        });
      } else {
        if (!customHoTen.trim() || !customMaDinhDanh.trim()) {
          alert("Vui lòng nhập đầy đủ họ tên và mã định danh");
          return;
        }
        console.log("➕ Cập nhật thủ công:", {
          id: customMaDinhDanh,
          hoTen: customHoTen,
          dangKy,
        });
      }

      alert("✅ Cập nhật thành công!");
    } catch (error) {
      console.error("❌ Lỗi cập nhật:", error);
      alert("Cập nhật thất bại!");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #e3f2fd, #bbdefb)",
        py: 6,
        px: 2,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <Box maxWidth={450} width="100%">
        <Card elevation={10} sx={{ p: 4, borderRadius: 4, backgroundColor: "white" }}>
          <Typography
            variant="h5"
            align="center"
            fontWeight="bold"
            color="primary"
            gutterBottom
            sx={{ borderBottom: "3px solid #1976d2", pb: 1, mb: 3 }}
          >
            CẬP NHẬT DANH SÁCH BÁN TRÚ
          </Typography>

          {loading ? (
            <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", my: 2 }}>
              <Box sx={{ width: "60%" }}>
                <LinearProgress />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Đang tải dữ liệu học sinh...
              </Typography>
            </Box>
          ) : (
            <>
              {/* --- RADIO NÚT ĐẶT TRÊN CÙNG --- */}
              <FormControl component="fieldset" sx={{ mb: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
                  <RadioGroup
                    value={nhapTuDanhSach}
                    onChange={(e) => setNhapTuDanhSach(e.target.value)}
                    row
                    sx={{ justifyContent: "center", display: "flex", width: "100%" }}
                  >
                    <FormControlLabel
                      value="danhSach"
                      control={<Radio size="small" />}
                      label="Chọn từ danh sách"
                    />
                    <FormControlLabel
                      value="thuCong"
                      control={<Radio size="small" />}
                      label="Nhập thủ công"
                    />
                  </RadioGroup>
                </Box>
              </FormControl>

              {/* --- DROPDOWN LỚP --- */}
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel>Lớp</InputLabel>
                <Select
                  value={selectedClass}
                  label="Lớp"
                  onChange={(e) => setSelectedClass(e.target.value)}
                >
                  <MenuItem value="">
                    <em>Chọn lớp</em>
                  </MenuItem>
                  {classList.map((cls) => (
                    <MenuItem key={cls} value={cls}>
                      {cls}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* --- NỘI DUNG NHẬP --- */}
              {nhapTuDanhSach === "danhSach" ? (
                <>
                  <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                    <InputLabel>Học sinh</InputLabel>
                    <Select
                      value={selectedStudentId}
                      label="Học sinh"
                      onChange={(e) => setSelectedStudentId(e.target.value)}
                      disabled={!selectedClass}
                    >
                      <MenuItem value="">
                        <em>Chọn học sinh</em>
                      </MenuItem>
                      {filteredStudents.map((s) => (
                        <MenuItem key={s.id} value={s.id}>
                          {s["HỌ VÀ TÊN"]}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    label="Mã định danh"
                    size="small"
                    fullWidth
                    value={selectedStudentData?.id || ""}
                    InputProps={{ readOnly: true }}
                    disabled
                    sx={{ mb: 2 }}
                  />
                </>
              ) : (
                <>
                  <TextField
                    label="Họ và tên"
                    size="small"
                    fullWidth
                    value={customHoTen}
                    onChange={(e) => setCustomHoTen(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="Mã định danh"
                    size="small"
                    fullWidth
                    value={customMaDinhDanh}
                    onChange={(e) => setCustomMaDinhDanh(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                </>
              )}

              <FormControl fullWidth size="small" sx={{ mb: 3 }}>
                <InputLabel>Trạng thái đăng ký</InputLabel>
                <Select
                  value={dangKy}
                  label="Trạng thái đăng ký"
                  onChange={(e) => setDangKy(e.target.value)}
                  disabled={nhapTuDanhSach === "danhSach" ? !selectedStudentData : false}
                >
                  <MenuItem value="">
                    <em>Chọn trạng thái</em>
                  </MenuItem>
                  {dangKyOptions.map((opt) => (
                    <MenuItem key={opt} value={opt}>
                      {opt}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Stack spacing={2}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleUpdate}
                  disabled={saving}
                >
                  {saving ? "🔄 Đang cập nhật..." : "Cập nhật"}
                </Button>
                <Button onClick={onBack} color="secondary">
                  ⬅️ Quay lại
                </Button>
              </Stack>
            </>
          )}
        </Card>
      </Box>
    </Box>
  );
}
