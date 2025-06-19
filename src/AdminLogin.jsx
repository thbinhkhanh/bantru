import React, { useState, useEffect } from "react";
import {
  Box, Typography, TextField, Button, Alert, Stack,
  Switch, FormControlLabel, Card, Divider
} from "@mui/material";
import {
  LockOutlined as LockIcon,
  Settings as SettingsIcon,
  Backup as BackupIcon,
  Restore as RestoreIcon
} from "@mui/icons-material";

import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import {
  downloadBackupAsJSON,
  restoreFromJSONFile
} from "./utils/backup"; // ⬅️ Cần file utils/backup.js

export default function AdminLogin({ onCancel }) {
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);

  const [firestoreEnabled, setFirestoreEnabled] = useState(false);
  const [savedAdminPassword, setSavedAdminPassword] = useState("123");
  const [savedUserPassword, setSavedUserPassword] = useState("@bc");

  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");

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

  const handleAdminLogin = async () => {
    if (adminPassword === savedAdminPassword) {
      setAdminLoggedIn(true);
      setAdminError("");
    } else {
      setAdminError("❌ Sai mật khẩu!");
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
    const newPass = type === "admin" ? newAdminPassword : newUserPassword;
    if (!newPass.trim()) return alert("⚠️ Vui lòng nhập mật khẩu mới!");

    try {
      await setDoc(doc(db, "SETTINGS", type === "admin" ? "ADMIN" : "USER"), {
        password: newPass,
      });
      if (type === "admin") {
        setSavedAdminPassword(newPass);
        setNewAdminPassword("");
        alert("✅ Đã đổi mật khẩu Admin!");
      } else {
        setSavedUserPassword(newPass);
        setNewUserPassword("");
        alert("✅ Đã đổi mật khẩu User!");
      }
    } catch (err) {
      alert("❌ Không thể đổi mật khẩu!");
    }
  };

  return (
    <Box maxWidth={450} mx="auto" mt={4}>
      <Card elevation={10} sx={{ p: 4, borderRadius: 4 }}>
        <Stack spacing={3}>
          <Box textAlign="center">
            <LockIcon sx={{ fontSize: 48, color: 'primary.main' }} />
            <Typography variant="h5" fontWeight="bold" color="primary" sx={{ mb: 2 }}>
              QUẢN TRỊ HỆ THỐNG
            </Typography>


          </Box>

          {!adminLoggedIn ? (
            <>
              <TextField label="Tên đăng nhập" fullWidth value="Admin" disabled />
              <TextField
                label="Mật khẩu"
                type="password"
                fullWidth
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
              />
              {adminError && <Alert severity="error">{adminError}</Alert>}
              <Button
                variant="contained"
                fullWidth
                onClick={handleAdminLogin}
                sx={{
                  height: 40,            // ✅ chiều cao cố định 40px
                  fontWeight: 'bold',
                  fontSize: '16px',
                }}
              >
                🔓 Đăng nhập
              </Button>

            </>
          ) : (
            <>
              <Divider>⚙️ Cài đặt hệ thống</Divider>

              <FormControlLabel
                control={
                  <Switch
                    checked={firestoreEnabled}
                    onChange={handleToggleChange}
                  />
                }
                label="Bật chế độ dùng Firestore"
              />

              <TextField
                label="🔐 Mật khẩu mới (Admin)"
                type="password"
                fullWidth
                value={newAdminPassword}
                onChange={(e) => setNewAdminPassword(e.target.value)}
              />
              <Button variant="contained" color="warning" onClick={() => handleChangePassword("admin")}>
                Đổi mật khẩu Admin
              </Button>

              <TextField
                label="👤 Mật khẩu mới (User)"
                type="password"
                fullWidth
                value={newUserPassword}
                onChange={(e) => setNewUserPassword(e.target.value)}
              />
              <Button variant="contained" color="info" onClick={() => handleChangePassword("user")}>
                Đổi mật khẩu User
              </Button>

              <Divider>💾 Sao lưu & Phục hồi</Divider>

              <Button variant="contained" color="success" onClick={downloadBackupAsJSON}>
                📥 Sao lưu dữ liệu JSON
              </Button>

              <Button
                variant="contained"
                color="secondary"
                component="label"
              >
                🔁 Phục hồi từ file JSON
                <input
                  type="file"
                  accept=".json"
                  hidden
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      restoreFromJSONFile(e.target.files[0]);
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
