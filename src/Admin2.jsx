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
// ❌ Đã xóa dòng import Banner
import { useNavigate } from "react-router-dom";

export default function Admin2({ onCancel }) {
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
      {/* ❌ Đã xoá Banner */}
      <Box sx={{ width: { xs: '90%', sm: 400 }, mx: 'auto', mt: 3 }}>
        <Card elevation={10} sx={{ p: 4, borderRadius: 4 }}>
          <Stack spacing={3}>
            <Divider>
              <Typography fontWeight="bold">⚙️ Cài đặt hệ thống</Typography>
            </Divider>

            {/* phần còn lại giữ nguyên */}
            ...
          </Stack>
        </Card>
      </Box>
    </Box>
  );
}
