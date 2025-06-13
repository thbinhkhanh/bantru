const admin = require("firebase-admin"); 
const cron = require("node-cron");

// Khởi tạo Firebase Admin SDK với Project ID
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: "ban-tru-data", // Thay ID dự án cho đúng
});

const db = admin.firestore();

// Định nghĩa cron job chạy mỗi ngày lúc 16:15
cron.schedule("15 16 * * *", async () => {
  console.log("🚀 Đang reset dữ liệu điểm danh...");

  try {
    const snapshot = await db.collection("BANTRU").where("HỦY ĐK", "==", "").get();
    const batch = db.batch();

    snapshot.docs.forEach(doc => {
      batch.update(doc.ref, { "ĐĂNG KÝ": "T" });
    });

    await batch.commit();
    console.log("✅ Reset dữ liệu thành công!");
  } catch (err) {
    console.error("❌ Lỗi khi reset dữ liệu:", err);
  }
});

console.log("🚀 Cron Job đã khởi động! Dữ liệu sẽ reset mỗi ngày lúc 16:15.");