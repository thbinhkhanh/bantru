const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

// Cloud Function: Reset "ĐĂNG KÝ" mỗi ngày vào 5 giờ sáng
exports.resetAttendance = functions.pubsub
  .schedule("every day 15:50")
  .timeZone("Asia/Ho_Chi_Minh") // Đặt múi giờ Việt Nam (GMT+7)
  .onRun(async () => {
    try {
      const snapshot = await db.collection("BANTRU").where("HỦY ĐK", "==", "").get();
      const batch = db.batch();

      snapshot.docs.forEach(doc => {
        batch.update(doc.ref, { "ĐĂNG KÝ": "T" });
      });

      await batch.commit();
      console.log("✅ Đã reset điểm danh thành công!");
    } catch (err) {
      console.error("❌ Lỗi khi reset dữ liệu:", err);
    }
  });