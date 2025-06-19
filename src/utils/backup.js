import { db } from "../firebase";
import { doc, setDoc, collection, getDocs, Timestamp } from "firebase/firestore";
import * as XLSX from "xlsx";

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
          if (value instanceof Timestamp) {
            converted[key] = value.toDate().toISOString();
          } else {
            converted[key] = value;
          }
        }

        backupContent[colName][docSnap.id] = converted;
      }
    }

    const blob = new Blob([JSON.stringify(backupContent, null, 2)], { type: "application/json" });
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
export const restoreFromJSONFile = async (file) => {
  try {
    if (!file) return alert("⚠️ Chưa chọn file để phục hồi!");

    const text = await file.text();
    const jsonData = JSON.parse(text);

    for (const [collectionName, documents] of Object.entries(jsonData)) {
      for (const [docId, docData] of Object.entries(documents)) {
        const restoredData = {};

        for (const [key, value] of Object.entries(docData)) {
          if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
            const date = new Date(value);
            restoredData[key] = isNaN(date.getTime()) ? value : Timestamp.fromDate(date);
          } else {
            restoredData[key] = value;
          }
        }

        await setDoc(doc(db, collectionName, docId), restoredData, { merge: true });
      }
    }

    alert("✅ Đã phục hồi dữ liệu từ JSON thành công!");
  } catch (error) {
    console.error("❌ Lỗi khi phục hồi JSON:", error);
    alert("❌ Không thể phục hồi dữ liệu.");
  }
};

/**
 * 📥 Sao lưu dữ liệu ra Excel (.xlsx)
 */
export const downloadBackupAsExcel = async () => {
  try {
    const collectionsToBackup = ["BANTRU", "DANHSACH", "SETTINGS"];
    const workbook = XLSX.utils.book_new();

    for (const colName of collectionsToBackup) {
      const colSnap = await getDocs(collection(db, colName));

      const dateFieldSet = new Set();
      const rawDocs = [];

      for (const docSnap of colSnap.docs) {
        const rawData = docSnap.data();
        const converted = { id: docSnap.id };

        for (const [key, value] of Object.entries(rawData)) {
          // Phát hiện các field ngày theo pattern yyyy/mm/dd
          const isDateField = /^\d{4}\/\d{1,2}\/\d{1,2}$/.test(key);
          if (isDateField) {
            dateFieldSet.add(key);
          }

          // Không chuyển giá trị ngày thành ISO nếu là field kiểu ngày dạng chuỗi
          if (value instanceof Timestamp) {
            converted[key] = value.toDate().toISOString(); // chỉ Timestamp mới chuyển
          } else {
            converted[key] = value;
          }
        }

        rawDocs.push(converted);
      }

      const dateFields = [...dateFieldSet].sort((a, b) => new Date(a) - new Date(b));
      const fixedFields = ["stt", "maDinhDanh", "hoVaTen", "lop", "huyDangKy"];
      const finalFields = [...fixedFields, ...dateFields];

      const orderedData = rawDocs.map((item) => {
        const ordered = {};
        for (const field of finalFields) {
          ordered[field] = item[field] || "";
        }
        ordered["id"] = item["id"];
        return ordered;
      });

      const worksheet = XLSX.utils.json_to_sheet(orderedData, { header: [...finalFields, "id"] });
      XLSX.utils.book_append_sheet(workbook, worksheet, colName);
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    XLSX.writeFile(workbook, `backup-${timestamp}.xlsx`);
    console.log("✅ Đã tạo file Excel sao lưu!");
  } catch (error) {
    console.error("❌ Lỗi khi tạo file Excel:", error);
    alert("❌ Không thể sao lưu dữ liệu Excel.");
  }
};


/**
 * 🔁 Phục hồi dữ liệu từ Excel (.xlsx) có kiểm tra cột bắt buộc
 */
export const restoreFromExcelFile = async (file) => {
  try {
    if (!file) return alert("⚠️ Chưa chọn file để phục hồi!");

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: "array" });

    const requiredFields = ["stt", "maDinhDanh", "hoVaTen", "lop", "huyDangKy"];

    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(sheet);

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const { id, ...rawDoc } = row;

        for (const field of requiredFields) {
          if (!(field in rawDoc)) {
            alert(`❌ Dòng ${i + 2} trong sheet "${sheetName}" thiếu cột '${field}'!`);
            return;
          }
        }

        const docData = {};
        for (const [key, value] of Object.entries(rawDoc)) {
          if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
            const date = new Date(value);
            docData[key] = isNaN(date.getTime()) ? value : Timestamp.fromDate(date);
          } else {
            docData[key] = value;
          }
        }

        if (id) {
          await setDoc(doc(db, sheetName, id.toString()), docData, { merge: true });
        }
      }
    }

    alert("✅ Đã phục hồi dữ liệu từ Excel thành công!");
  } catch (error) {
    console.error("❌ Lỗi khi phục hồi Excel:", error);
    alert("❌ Không thể phục hồi dữ liệu từ file Excel.");
  }
};
