import React, { useState, useEffect } from "react";
import {
  Box, Typography, TextField, Button, Alert, Stack,
  Switch, FormControlLabel, Card, Divider,
  Select, MenuItem, FormControl, InputLabel,
  RadioGroup, Radio
} from "@mui/material";
import {
  doc, setDoc, getDoc
} from "firebase/firestore";
import { db } from "./firebase";
import {
  downloadBackupAsJSON,
  restoreFromJSONFile,
  downloadBackupAsExcel,
  restoreFromExcelFile
} from "./utils/backup"; // Cần bổ sung thêm hàm Excel trong utils/backup.js

export default function AdminLogin({ onCancel }) {
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);

  const [firestoreEnabled, setFirestoreEnabled] = useState(false);
  const [savedAdminPassword, setSavedAdminPassword] = useState("123");
  const [savedUserPassword, setSavedUserPassword] = useState("@bc");

  const [selectedAccount, setSelectedAccount] = useState("admin");
  const [newPassword, setNewPassword] = useState("");

  const [backupFormat, setBackupFormat] = useState("json");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const adminSnap = await getDoc(doc(db, "SETTINGS", "ADMIN"));
        const userSnap = await getDoc(doc(db, "SETTINGS", "USER"));
        const toggleSnap = await getDoc(doc(db, "SETTINGS", "TOGGLE"));

        if (adminSnap.exists()) setSavedAdminPassword(adminSnap.data().password || "123");
        if (userSnap.exists()) setSavedUserPassword(userSnap.data().password || "@bc");
        if (toggleSnap.exists()) setFirestoreEnabled(toggleSnap.data().useNewVersion);
      } catch (error) {
        console.error("❌ Lỗi khi tải cấu hình:", error);
      }
    };
    fetchSettings();
  }, []);

  const handleAdminLogin = () => {
    if (adminPassword === savedAdminPassword) {
      setAdminLoggedIn(true);
      setAdminError("");
    } else {
      setAdminError("❌ Mật khẩu không chính xác!");
    }
  };

  const handleToggleChange = async (e) => {
    const newValue = e.target.checked;
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
      if (type === "admin") setSavedAdminPassword(newPassword);
      else setSavedUserPassword(newPassword);

      alert(`✅ Đã đổi mật khẩu ${type === "admin" ? "Admin" : "User"}!`);
      setNewPassword("");
    } catch (err) {
      alert("❌ Không thể đổi mật khẩu!");
    }
  };

  return (
    <Box maxWidth={450} mx="auto" mt={2}>
      <Card elevation={10} sx={{ p: 4, borderRadius: 4 }}>
        <Stack spacing={3}>
          <Box textAlign="center" sx={{ mb: 2 }}>
            <Box sx={{ fontSize: 48, color: 'primary.main', mb: 1 }}>
              🔐
            </Box>
            <Typography variant="h5" fontWeight="bold" color="primary" sx={{ mb: 2 }}>
              QUẢN TRỊ HỆ THỐNG
            </Typography>
          </Box>

          {!adminLoggedIn ? (
            <>
              <TextField
                label="👤 Tên đăng nhập"
                value="Admin"
                fullWidth
                disabled
              />
              <TextField
                label="🔒 Mật khẩu"
                type="password"
                fullWidth
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
              />
              {adminError && (
                <Alert severity="error" variant="filled">{adminError}</Alert>
              )}
              <Button
                variant="contained"
                fullWidth
                onClick={handleAdminLogin}
                sx={{ height: 40, fontWeight: 'bold', fontSize: '16px' }}
              >
                🔓 Đăng nhập
              </Button>
            </>
          ) : (
            <>
              <Divider>
                <Typography fontWeight="bold">⚙️ Cài đặt hệ thống</Typography>
              </Divider>

              <FormControlLabel
                control={
                  <Switch
                    checked={firestoreEnabled}
                    onChange={handleToggleChange}
                  />
                }
                label="Bật chế độ dùng Firestore"
              />

              <FormControl fullWidth>
                <InputLabel id="account-select-label">Loại tài khoản</InputLabel>
                <Select
                  labelId="account-select-label"
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
                    if (file) {
                      backupFormat === "json"
                        ? restoreFromJSONFile(file)
                        : restoreFromExcelFile(file);
                    }
                  }}
                />
              </Button>

              <Button variant="outlined" fullWidth onClick={onCancel}>
                ⬅️ Quay lại
              </Button>
            </>
          )}
        </Stack>
      </Card>
    </Box>
  );
}
