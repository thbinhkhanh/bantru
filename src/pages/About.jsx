import React from "react";
import {
  Typography,
  Container,
  Divider,
  Card,
  CardContent,
  Link,
  Box,
} from "@mui/material";
import Banner from "./Banner";

export default function About() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #e3f2fd, #bbdefb)",
        py: 0,
        px: 0,
      }}
    >
      <Banner title="GIỚI THIỆU" />

      <Container maxWidth="md" sx={{ mt: 3, mb: 4 }}>
        <Card elevation={3} sx={{ borderRadius: 3, p: 2 }}>
          <CardContent>
            <Typography
              variant="h6"
              color="primary"
              fontWeight="bold"
              align="center"
              sx={{ mb: 1, fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' } }}
            >
              HỆ THỐNG ĐIỂM DANH BÁN TRÚ
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body1" paragraph sx={{ mt: 0, mb: 2 }}>
              Ứng dụng <strong>Quản lý Bán trú Trường Tiểu học Bình Khánh</strong> được phát triển nhằm hỗ trợ giáo viên và nhà trường trong việc quản lý học sinh bán trú, cập nhật số liệu và thống kê nhanh chóng, chính xác.
            </Typography>

            <Divider sx={{ my: 3 }} />

            {/* 🗓️ QUẢN LÝ DỮ LIỆU NGÀY */}
            <Typography variant="h6" color="primary" fontWeight="bold" sx={{ mt: 4, mb: 1.5 }}>
              🗓️ Quản lý dữ liệu ngày
            </Typography>
            <Typography variant="body1" paragraph>📌 <strong>Chốt số liệu</strong>: Ghi nhận danh sách học sinh ăn bán trú trong ngày hiện tại.</Typography>
            <Typography variant="body1" paragraph>📊 <strong>Số liệu trong ngày</strong>: Xem nhanh sĩ số và số lượng học sinh ăn bán trú theo từng lớp.</Typography>
            <Typography variant="body1" paragraph>🛠️ <strong>Điều chỉnh suất ăn</strong>: Chỉnh sửa đăng ký suất ăn của học sinh trong ngày bất kỳ.</Typography>
            <Typography variant="body1" paragraph>🗑️ <strong>Xóa dữ liệu theo ngày</strong>: Xóa dữ liệu đã chốt trong ngày bất kỳ để cập nhật lại.</Typography>

            <Divider sx={{ my: 3 }} />

            {/* 📈 THỐNG KÊ */}
            <Typography variant="h6" color="primary" fontWeight="bold" sx={{ mt: 4, mb: 1.5 }}>
              📈 Thống kê
            </Typography>
            <Typography variant="body1" paragraph>🗓️ <strong>Thống kê theo ngày</strong>: Tổng hợp theo từng lớp một ngày bất kỳ.</Typography>
            <Typography variant="body1" paragraph>📅 <strong>Chi tiết từng tháng</strong>: Thống kê từng ngày trong tháng.</Typography>
            <Typography variant="body1" paragraph>📚 <strong>Tổng hợp cả năm</strong>: Thống kê toàn bộ số lần ăn trong năm học.</Typography>

            <Divider sx={{ my: 3 }} />

            {/* 👥 DANH SÁCH HỌC SINH */}
            <Typography variant="h6" color="primary" fontWeight="bold" sx={{ mt: 4, mb: 1.5 }}>
              👥 Danh sách học sinh
            </Typography>
            <Typography variant="body1" paragraph>📥 <strong>Cập nhật danh sách</strong>: Thêm, xóa học sinh đăng ký bán trú.</Typography>
            <Typography variant="body1" paragraph>📋 <strong>Lập danh sách bán trú</strong>: Chọn học sinh đăng ký bán trú theo lớp.</Typography>
            <Typography variant="body1" paragraph>📤 <strong>Tải danh sách lên</strong>: Tải danh sách học sinh lên hệ thống từ file Excel.</Typography>

            {/* Có thể bỏ nhóm quản trị nếu đã bị loại khỏi giao diện chính */}

            <Divider sx={{ my: 4 }} />

            {/* Footer */}
            <Typography variant="body1" paragraph>
              Mọi góp ý xin gửi về:{" "}
              <Link href="mailto:thbinhkhanh@gmail.com" color="primary" underline="hover">
                thbinhkhanh@gmail.com
              </Link>
            </Typography>
            <Typography variant="body2" align="right" color="text.secondary">
              Phiên bản 1.0.0 — Cập nhật: 21/06/2025
            </Typography>
            <Typography variant="body2" align="center" color="text.secondary" sx={{ mt: 3 }}>
              © 2025 thbinhkhanh@gmail.com. Thiết kế và phát triển bởi Thái Phạm.
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
