// ./utils/backup.js
import { db } from "../firebase";
import { doc, setDoc, collection, getDocs } from "firebase/firestore";

// 🎯 Hàm sao lưu dữ liệu
export const downloadBackupAsJSON = async () => {
  try {
    const collectionsToBackup = ["BANTRU", "DANHSACH", "SETTINGS"];
    const backupContent = {};

    for (const colName of collectionsToBackup) {
      const colSnap = await getDocs(collection(db, colName));
      backupContent[colName] = {};
      for (const docSnap of colSnap.docs) {
        backupContent[colName][docSnap.id] = docSnap.data();
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

// 🔁 Hàm phục hồi dữ liệu từ file JSON
export const restoreFromJSONFile = async (file) => {
  try {
    if (!file) {
      alert("⚠️ Chưa chọn file để phục hồi!");
      return;
    }

    const text = await file.text();
    const jsonData = JSON.parse(text);

    for (const [collectionName, documents] of Object.entries(jsonData)) {
      for (const [docId, docData] of Object.entries(documents)) {
        await setDoc(doc(db, collectionName, docId), docData, { merge: true });
      }
    }

    alert("✅ Đã phục hồi dữ liệu thành công!");
  } catch (error) {
    console.error("❌ Lỗi khi phục hồi dữ liệu:", error);
    alert("❌ Không thể phục hồi dữ liệu.");
  }
};
