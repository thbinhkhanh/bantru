import React, { useState, useEffect } from "react";
import {
  Box, Typography, TextField, Button, Stack,
  Card, Divider, Select, MenuItem, FormControl, InputLabel,
  RadioGroup, Radio, FormControlLabel, LinearProgress, Alert
} from "@mui/material";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import {
  downloadBackupAsJSON,
  downloadBackupAsExcel,
  restoreFromJSONFile,
  restoreFromExcelFile
} from "./utils/backup";
import Banner from "./pages/Banner";
import { useNavigate } from "react-router-dom";

export default function Admin({ onCancel }) {
  const [firestoreEnabled, setFirestoreEnabled] = useState(false);
  const [savedAdminPassword, setSavedAdminPassword] = useState("123");
  const [savedUserPassword, setSavedUserPassword] = useState("@bc");
  const [selectedAccount, setSelectedAccount] = useState("admin");
  const [newPassword, setNewPassword] = useState("");
  const [backupFormat, setBackupFormat] = useState("json");
  const [restoreProgress, setRestoreProgress] = useState(0);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const adminSnap = await getDoc(doc(db, "SETTINGS", "ADMIN"));
        const userSnap = await getDoc(doc(db, "SETTINGS", "USER"));
        const toggleSnap = await getDoc(doc(db, "SETTINGS", "TOGGLE"));

        if (adminSnap.exists()) {
          setSavedAdminPassword(adminSnap.data().password || "123");
        }
        if (userSnap.exists()) {
          setSavedUserPassword(userSnap.data().password || "@bc");
        }
        if (toggleSnap.exists()) {
          const isUseNew = toggleSnap.data().useNewVersion;
          setFirestoreEnabled(isUseNew);
        }
      } catch (error) {
        console.error("❌ Lỗi khi tải cấu hình:", error);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    if (restoreProgress === 100) {
      const timer = setTimeout(() => {
        setRestoreProgress(0);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [restoreProgress]);

  const handleToggleChange = async (e) => {
    const newValue = e.target.value === "khoi";
    setFirestoreEnabled(newValue);
    try {
      await setDoc(doc(db, "SETTINGS", "TOGGLE"), { useNewVersion: newValue });
    } catch (error) {
      alert("❌ Không thể cập nhật chế độ Firestore!");
    }
  };

  const handleChangePassword = async (type) => {
    if (!newPassword.trim()) return alert("⚠️ Vui lòng nhập mật khẩu mới!");
    try {
      await setDoc(doc(db, "SETTINGS", type.toUpperCase()), { password: newPassword });
      alert(`✅ Đã đổi mật khẩu ${type === "admin" ? "Admin" : "User"}!`);
      setNewPassword("");
    } catch (err) {
      alert("❌ Không thể đổi mật khẩu!");
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#e3f2fd' }}>
      <Banner title="QUẢN TRỊ HỆ THỐNG" />
      <Box sx={{ width: { xs: '90%', sm: 400 }, mx: 'auto', mt: 3 }}>
        <Card elevation={10} sx={{ p: 4, borderRadius: 4 }}>
          <Stack spacing={3}>
            <Divider>
              <Typography fontWeight="bold">⚙️ Cài đặt hệ thống</Typography>
            </Divider>

            <FormControl component="fieldset">
              <Typography variant="subtitle1" fontWeight="bold">
                📊 Tải dữ liệu từ Firestore
              </Typography>
              <RadioGroup
                row
                value={firestoreEnabled ? "khoi" : "lop"}
                onChange={handleToggleChange}
              >
                <FormControlLabel value="lop" control={<Radio />} label="Tải theo lớp" />
                <FormControlLabel value="khoi" control={<Radio />} label="Tải theo khối" />
              </RadioGroup>
            </FormControl>

            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/quanly")}
            >
              🏫 HỆ THỐNG QUẢN LÝ BÁN TRÚ
            </Button>

            <FormControl fullWidth>
              <InputLabel id="account-select-label">Loại tài khoản</InputLabel>
              <Select
                labelId="account-select-label"
                label="Loại tài khoản"
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
              >
                <MenuItem value="admin">🔐 Admin</MenuItem>
                <MenuItem value="user">👤 User</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="🔑 Mật khẩu mới"
              type="password"
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Button
              variant="contained"
              color="warning"
              onClick={() => handleChangePassword(selectedAccount)}
            >
              Đổi mật khẩu
            </Button>

            <Divider sx={{ my: 2 }}>
              <Typography fontWeight="bold" color="text.secondary">
                💾 Sao lưu & Phục hồi
              </Typography>
            </Divider>

            <RadioGroup
              row
              value={backupFormat}
              onChange={(e) => setBackupFormat(e.target.value)}
            >
              <FormControlLabel value="json" control={<Radio />} label="JSON" />
              <FormControlLabel value="excel" control={<Radio />} label="Excel" />
            </RadioGroup>

            <Button
              variant="contained"
              color="success"
              onClick={() =>
                backupFormat === "json"
                  ? downloadBackupAsJSON()
                  : downloadBackupAsExcel()
              }
            >
              📥 Sao lưu ({backupFormat.toUpperCase()})
            </Button>

            <Button
              variant="contained"
              color="secondary"
              component="label"
            >
              🔁 Phục hồi ({backupFormat.toUpperCase()})
              <input
                type="file"
                accept={backupFormat === "json" ? ".json" : ".xlsx"}
                hidden
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;

                  const confirmed = window.confirm("⚠️ Bạn có chắc chắn muốn phục hồi dữ liệu? Hành động này sẽ ghi đè dữ liệu hiện tại.");
                  if (!confirmed) {
                    e.target.value = ""; // reset input nếu huỷ
                    return;
                  }

                  const restore = async () => {
                    if (backupFormat === "json") {
                      await restoreFromJSONFile(file, setRestoreProgress, setAlertMessage, setAlertSeverity);
                    } else {
                      await restoreFromExcelFile(file, setRestoreProgress, setAlertMessage, setAlertSeverity);
                    }
                    e.target.value = ""; // reset sau khi xong
                  };

                  restore();
                }}
              />

            </Button>

            {restoreProgress > 0 && restoreProgress < 100 && (
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 2 }}>
                <Box sx={{ width: "100%" }}>
                  <LinearProgress
                    variant="determinate"
                    value={restoreProgress}
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                  <Typography variant="caption" align="center" display="block" mt={0.5}>
                    Đang phục hồi dữ liệu Firestore...{restoreProgress}% 
                  </Typography>
                </Box>
              </Box>
            )}

            {alertMessage && (
              <Box sx={{ width: "100%", mt: 2 }}>
                <Alert severity={alertSeverity} onClose={() => setAlertMessage("")}>
                  {alertMessage}
                </Alert>
              </Box>
            )}

          </Stack>
        </Card>
      </Box>
    </Box>
  );
}
