import React, { useState, useEffect } from "react";
import {
  Box, Typography, TextField, Button, Stack,
  Card, Divider, Select, MenuItem, FormControl, InputLabel,
  RadioGroup, Radio, FormControlLabel, LinearProgress, Alert, Tabs, Tab
} from "@mui/material";
import { doc, setDoc, getDoc, getDocs, collection, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

import {
  downloadBackupAsJSON,
  downloadBackupAsExcel
} from "./utils/backupUtils";

import {
  restoreFromJSONFile,
  restoreFromExcelFile
} from "./utils/restoreUtils";

import { deleteAllDateFields } from "./utils/deleteUtils";
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

  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [deleteSeverity, setDeleteSeverity] = useState("info");
  const [deleteProgress, setDeleteProgress] = useState(0);

  const [setDefaultProgress, setSetDefaultProgress] = useState(0);
  const [setDefaultMessage, setSetDefaultMessage] = useState("");
  const [setDefaultSeverity, setSetDefaultSeverity] = useState("success");

  const [tabIndex, setTabIndex] = useState(0);

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
      const timer = setTimeout(() => setRestoreProgress(0), 3000);
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

  const handleDeleteAll = async () => {
    const confirmed = window.confirm("⚠️ Bạn có chắc chắn muốn xóa tất cả dữ liệu? Hành động này không thể hoàn tác.");
    if (!confirmed) return;

    setDeleteInProgress(true);
    setDeleteMessage("");
    setDeleteProgress(0);

    try {
      await deleteAllDateFields({
        setDeleteProgress,
        setDeleteMessage,
        setDeleteSeverity,
      });
    } catch (error) {
      setDeleteMessage("❌ Lỗi khi xóa dữ liệu.");
      setDeleteSeverity("error");
    } finally {
      setDeleteInProgress(false);
    }
  };

  const handleSetDefault = async () => {
    const confirmed = window.confirm("⚠️ Bạn có chắc muốn reset điểm danh'?");
    if (!confirmed) return;

    try {
      setSetDefaultProgress(0);
      setSetDefaultMessage("");
      setSetDefaultSeverity("info");

      const snapshot = await getDocs(collection(db, "BANTRU"));
      const docs = snapshot.docs;
      const total = docs.length;

      let completed = 0;

      for (const docSnap of docs) {
        const data = docSnap.data();
        if (data.huyDangKy !== "x") {
          await setDoc(doc(db, "BANTRU", docSnap.id), {
            ...data,
            huyDangKy: "T",
          });
        }

        completed++;
        setSetDefaultProgress(Math.round((completed / total) * 100));
      }

      setSetDefaultMessage("✅ Đã reset điểm danh!");
      setSetDefaultSeverity("success");
    } catch (error) {
      console.error(error);
      setSetDefaultMessage("❌ Lỗi khi cập nhật huyDangKy.");
      setSetDefaultSeverity("error");
    } finally {
      setTimeout(() => setSetDefaultProgress(0), 3000);
    }
  };


  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#e3f2fd' }}>
      <Banner title="QUẢN TRỊ HỆ THỐNG" />

      <Box sx={{ width: { xs: '95%', sm: 450 }, mx: 'auto', mt: 3 }}>
        <Card elevation={10} sx={{ p: 3, borderRadius: 4 }}>
          <Tabs
            value={tabIndex}
            onChange={(e, newValue) => setTabIndex(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
          >
            <Tab label="⚙️ System" />
            <Tab label="🗄️ Database" />
          </Tabs>

          {/* Tab 1: Cài đặt hệ thống */}
          {tabIndex === 0 && (
            <Stack spacing={3} mt={3}>
              <Button variant="contained" color="primary" onClick={() => navigate("/quanly")}>
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

              <FormControl component="fieldset">
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2, mb: 1 }}>
                  📊 Tải dữ liệu từ Firestore
                </Typography>
                <RadioGroup
                  row
                  value={firestoreEnabled ? "khoi" : "lop"}
                  onChange={handleToggleChange}
                >
                  <FormControlLabel value="khoi" control={<Radio />} label="Tải theo khối" />
                  <FormControlLabel value="lop" control={<Radio />} label="Tải theo lớp" />
                  
                </RadioGroup>
              </FormControl>

            </Stack>
          )}

          {/* Tab 2: Cơ sở dữ liệu */}
          {tabIndex === 1 && (
            <Stack spacing={3} mt={3}>
              <Divider>
                <Typography fontWeight="bold">💾 Sao lưu & Phục hồi</Typography>
              </Divider>

              <RadioGroup
                row
                value={backupFormat}
                onChange={(e) => setBackupFormat(e.target.value)}
              >
                <FormControlLabel value="json" control={<Radio />} label="JSON" />
                <FormControlLabel value="excel" control={<Radio />} label="Excel" />
              </RadioGroup>

              <Button variant="contained" color="success" onClick={() =>
                backupFormat === "json"
                  ? downloadBackupAsJSON()
                  : downloadBackupAsExcel()
              }>
                📥 Sao lưu ({backupFormat.toUpperCase()})
              </Button>

              <Button variant="contained" color="secondary" component="label">
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
                      e.target.value = "";
                      return;
                    }

                    const restore = async () => {
                      if (backupFormat === "json") {
                        await restoreFromJSONFile(file, setRestoreProgress, setAlertMessage, setAlertSeverity);
                      } else {
                        await restoreFromExcelFile(file, setRestoreProgress, setAlertMessage, setAlertSeverity);
                      }
                      e.target.value = "";
                    };

                    restore();
                  }}
                />
              </Button>

              <Divider>
                <Divider sx={{ mt: 3, mb: 0 }}>
                  <Typography fontWeight="bold" color="error">🗑️ Xóa & Reset dữ liệu</Typography>
                </Divider>

              </Divider>

              <Button
                variant="contained"
                color="error"
                sx={{ backgroundColor: "#d32f2f", color: "#fff", "&:hover": { backgroundColor: "#9a0007" } }}
                onClick={handleDeleteAll}
              >
                🗑️ Xóa Database Firestore
              </Button>

              <Button
                variant="contained"
                color="primary"
                onClick={handleSetDefault}
              >
                ♻️ Reset điểm danh
              </Button>

              {/* Progress & Alerts */}
              {(restoreProgress > 0 && restoreProgress < 100) ||
                (deleteProgress > 0 && deleteProgress < 100) ||
                (setDefaultProgress > 0 && setDefaultProgress < 100) ? (
                <Box sx={{ mt: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={
                      restoreProgress > 0 ? restoreProgress
                        : deleteProgress > 0 ? deleteProgress
                          : setDefaultProgress
                    }
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                  <Typography variant="caption" align="center" display="block" mt={0.5}>
                    {restoreProgress > 0
                      ? `Đang phục hồi dữ liệu Firestore... ${restoreProgress}%`
                      : deleteProgress > 0
                        ? `Đang xóa dữ liệu Firestore... ${deleteProgress}%`
                        : `Đang reset điểm danh... ${setDefaultProgress}%`}
                  </Typography>
                </Box>
              ) : null}

              {alertMessage && (
                <Alert severity={alertSeverity} onClose={() => setAlertMessage("")}>{alertMessage}</Alert>
              )}
              {deleteMessage && (
                <Alert severity={deleteSeverity} onClose={() => setDeleteMessage("")}>{deleteMessage}</Alert>
              )}
              {setDefaultMessage && (
                <Alert severity={setDefaultSeverity} onClose={() => setSetDefaultMessage("")}>
                  {setDefaultMessage}
                </Alert>
              )}
            </Stack>
          )}
        </Card>
      </Box>
    </Box>
  );
}
