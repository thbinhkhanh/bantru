import React, { useState, useEffect } from "react";
import {
  Box, Typography, TextField, Button, Alert, Stack,
  Switch, FormControlLabel, Card
} from "@mui/material";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export default function AdminLogin({ onCancel }) {
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");
  const [firestoreEnabled, setFirestoreEnabled] = useState(false);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);

  // Lấy trạng thái `useNewVersion` từ Firestore khi đăng nhập thành công
  const fetchToggleState = async () => {
    try {
      const toggleSnap = await getDoc(doc(db, "SETTINGS", "TOGGLE"));
      if (toggleSnap.exists()) {
        setFirestoreEnabled(toggleSnap.data().useNewVersion);
      }
    } catch (error) {
      console.error("❌ Lỗi khi tải trạng thái toggle:", error);
    }
  };

  const handleAdminLogin = async () => {
    if (adminPassword === "123") {
      setAdminLoggedIn(true);
      setAdminError("");
      await fetchToggleState(); // Lấy trạng thái ngay sau khi đăng nhập thành công
    } else {
      setAdminError("Sai mật khẩu!");
    }
  };

  // Ghi trạng thái Toggle vào Firestore khi bật/tắt
  const handleToggleChange = async (event) => {
    const newValue = event.target.checked;
    setFirestoreEnabled(newValue);

    try {
      await setDoc(doc(db, "SETTINGS", "TOGGLE"), { useNewVersion: newValue });
      console.log("✅ Đã cập nhật trạng thái Toggle:", newValue);
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật toggle:", error);
    }
  };

  return (
    <Box maxWidth={360} mx="auto">
      <Card elevation={8} sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h5" color="primary" fontWeight="bold" align="center" gutterBottom sx={{ borderBottom: "2px solid #1976d2", pb: 1, mb: 3 }}>
          ĐĂNG NHẬP HỆ THỐNG
        </Typography>

        {!adminLoggedIn && (
          <>
            <TextField label="Tên đăng nhập" fullWidth margin="normal" value="Admin" disabled />
            <TextField label="Mật khẩu" fullWidth margin="normal" type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} />
            {adminError && (
              <Alert severity="error" sx={{ mt: 2 }}>{adminError}</Alert>
            )}
            <Button variant="contained" color="primary" fullWidth sx={{ mt: 3, fontWeight: "bold", py: 1.2 }} onClick={handleAdminLogin}>
              Đăng nhập
            </Button>
          </>
        )}

        {adminLoggedIn && (
          <Stack spacing={2}>
            <FormControlLabel
              control={
                <Switch checked={firestoreEnabled} onChange={handleToggleChange} />
              }
              label="Bật/Tắt chế độ tải dữ liệu từ Firestore"
              sx={{ mt: 1 }}
            />
            <Button variant="outlined" color="secondary" fullWidth sx={{ fontWeight: "bold", py: 1.2 }} onClick={onCancel}>
              ⬅️ Quay lại
            </Button>
          </Stack>
        )}
      </Card>
    </Box>
  );
}