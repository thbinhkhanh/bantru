// 📁 backupUtils.js
import {
  collection,
  getDocs,
  Timestamp,
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { formatExcel } from "./formatExcel.js";
import * as XLSX from "xlsx";

/** 🎯 Sao lưu toàn bộ Firestore sang JSON */
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
          converted[key] = value instanceof Timestamp ? value.toDate().toISOString() : value;
        }

        backupContent[colName][docSnap.id] = converted;
      }
    }

    const blob = new Blob([JSON.stringify(backupContent, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    // ✅ Đặt tên theo định dạng backup (21_06_2025 14_35).json
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    const filename = `Backup Firestore (${day}_${month}_${year} ${hours}_${minutes}).json`;
    link.download = filename;
    link.click();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
    console.log("✅ Đã tạo file JSON sao lưu!");
  } catch (error) {
    console.error("❌ Lỗi khi tạo file JSON:", error);
    alert("❌ Không thể sao lưu dữ liệu.");
  }
};


/** 📥 Sao lưu dữ liệu ra Excel (.xlsx) */
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
        huyDangKy: rawData.huyDangKy || "",
        banTruNgay: {},
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
    rawDocs.forEach((item) => {
      Object.keys(item.banTruNgay || {}).forEach((d) => dateSet.add(d));
    });
    const columnDates = Array.from(dateSet).sort((a, b) => new Date(a) - new Date(b));

    const year = new Date().getFullYear();
    const selectedClass = "Tất cả";

    formatExcel(rawDocs, columnDates, year, selectedClass);
  } catch (error) {
    console.error("❌ Lỗi khi tạo file Excel:", error);
    alert("❌ Không thể sao lưu dữ liệu Excel.");
  }
};
