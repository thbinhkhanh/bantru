// backupHelpers.js

import {
  collection,
  doc,
  getDocs,
  setDoc,
  Timestamp
} from "firebase/firestore";
import { db } from "../firebase";
import * as XLSX from "xlsx";
import { backupToExcel } from "./formatExcel.js";

/**
 * 🎯 Sao lưu toàn bộ Firestore sang JSON
 */
export const downloadBackupAsJSON = async () => {
  try {
    const collectionsToBackup = ["BANTRU", "DANHSACH", "SETTINGS"];
    const backupContent = {};

    for (const colName of collectionsToBackup) {
      const colSnap = await getDocs(collection(db, colName));
      backupContent[colName] = {};

      for (const docSnap of colSnap.docs) {
        const rawData = docSnap.data();
        const converted = {};

        for (const [key, value] of Object.entries(rawData)) {
          converted[key] =
            value instanceof Timestamp ? value.toDate().toISOString() : value;
        }

        backupContent[colName][docSnap.id] = converted;
      }
    }

    const blob = new Blob([JSON.stringify(backupContent, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    link.download = `backup-${timestamp}.json`;
    link.click();

    console.log("✅ Đã tạo file JSON sao lưu!");
  } catch (error) {
    console.error("❌ Lỗi khi tạo file JSON:", error);
    alert("❌ Không thể sao lưu dữ liệu.");
  }
};

/**
 * 🔁 Phục hồi dữ liệu từ file JSON
 */
export const restoreFromJSONFile = async (
  file,
  setRestoreProgress,
  setAlertMessage,
  setAlertSeverity
) => {
  try {
    if (!file) return alert("⚠️ Chưa chọn file để phục hồi!");

    const text = await file.text();
    const jsonData = JSON.parse(text);
    const collections = Object.entries(jsonData);

    let totalDocs = 0;
    collections.forEach(([_, docs]) => {
      totalDocs += Object.keys(docs).length;
    });

    let processed = 0;

    for (const [collectionName, documents] of collections) {
      for (const [docId, docData] of Object.entries(documents)) {
        const restoredData = {};

        for (const [key, value] of Object.entries(docData)) {
          if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
            const date = new Date(value);
            restoredData[key] = isNaN(date.getTime())
              ? value
              : Timestamp.fromDate(date);
          } else {
            restoredData[key] = value;
          }
        }

        await setDoc(doc(db, collectionName, docId), restoredData, {
          merge: true
        });

        processed++;
        setRestoreProgress(Math.round((processed / totalDocs) * 100));
      }
    }

    setRestoreProgress(100);
    setAlertMessage("✅ Đã phục hồi dữ liệu thành công!");
    setAlertSeverity("success");
  } catch (error) {
    console.error("❌ Lỗi khi phục hồi JSON:", error);
    setAlertMessage(`❌ Lỗi khi phục hồi: ${error.message}`);
    setAlertSeverity("error");
  }
};

/**
 * 📥 Sao lưu dữ liệu ra Excel (.xlsx)
 */
export const downloadBackupAsExcel = async () => {
  try {
    const colSnap = await getDocs(collection(db, "BANTRU"));
    const rawDocs = [];

    for (const docSnap of colSnap.docs) {
      const rawData = docSnap.data();
      const converted = {
        id: docSnap.id,
        hoVaTen: rawData.hoVaTen || "",
        lop: rawData.lop || "",
        huyDangKy: rawData.huyDangKy || "", // 👉 Giữ nguyên dạng "x", "T", ""
        banTruNgay: {}
      };

      for (const [key, value] of Object.entries(rawData)) {
        if (value instanceof Timestamp) {
          converted[key] = value.toDate().toISOString();
        } else if (key === "data" && typeof value === "object") {
          for (const [dateStr, status] of Object.entries(value)) {
            converted.banTruNgay[dateStr] = status;
          }
        }
      }

      rawDocs.push(converted);
    }

    if (rawDocs.length === 0) {
      alert("Không có dữ liệu để sao lưu.");
      return;
    }

    const dateSet = new Set();
    rawDocs.forEach(item => {
      Object.keys(item.banTruNgay || {}).forEach(d => dateSet.add(d));
    });
    const columnDates = Array.from(dateSet).sort(
      (a, b) => new Date(a) - new Date(b)
    );

    const year = new Date().getFullYear();
    const selectedClass = "Tất cả";

    // 🎯 Gọi hàm xử lý Excel đẹp
    backupToExcel(rawDocs, columnDates, year, selectedClass);
  } catch (error) {
    console.error("❌ Lỗi khi tạo file Excel:", error);
    alert("❌ Không thể sao lưu dữ liệu Excel.");
  }
};

/**
 * 🔁 Phục hồi dữ liệu từ Excel (.xlsx)
 */
export const restoreFromExcelFile = async (
  file,
  setRestoreProgress,
  setAlertMessage,
  setAlertSeverity
) => {
  try {
    if (!file) return alert("⚠️ Chưa chọn file để phục hồi!");

    setRestoreProgress(0); // Bắt đầu từ 0%

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: "array" });

    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    if (!rows || rows.length === 0) {
      setAlertMessage("⚠️ File Excel không chứa dữ liệu.");
      setAlertSeverity("warning");
      return;
    }

    const totalRows = rows.length;
    let processed = 0;

    for (const row of rows) {
      const { id, ...rawDoc } = row;
      if (!id) continue;

      const docData = {};
      const dataField = {};

      for (const [key, value] of Object.entries(rawDoc)) {
        if (/^\d{4}[/-]\d{2}[/-]\d{2}/.test(key)) {
          const normalizedDate = key.replace(/\//g, "-");
          dataField[normalizedDate] = value;
        } else if (
          typeof value === "string" &&
          /^\d{4}-\d{2}-\d{2}T/.test(value)
        ) {
          const date = new Date(value);
          docData[key] = isNaN(date.getTime())
            ? value
            : Timestamp.fromDate(date);
        } else {
          docData[key] = value;
        }
      }

      if (Object.keys(dataField).length > 0) {
        docData.data = dataField;
      }

      await setDoc(doc(db, "BANTRU", id.toString()), docData, { merge: true });

      processed++;
      setRestoreProgress(Math.round((processed / totalRows) * 100));
    }

    setRestoreProgress(100);
    setTimeout(() => {
      setAlertMessage("✅ Đã phục hồi dữ liệu thành công!");
      setAlertSeverity("success");
    }, 500);
  } catch (error) {
    console.error("❌ Lỗi khi phục hồi Excel:", error);
    setAlertMessage(`❌ Lỗi khi phục hồi: ${error.message}`);
    setAlertSeverity("error");
  }
};



