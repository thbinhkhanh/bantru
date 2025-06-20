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

      <Container maxWidth="md" sx={{ mt: 2, mb: 4 }}>
        <Card elevation={3} sx={{ borderRadius: 3, p: 2 }}>
          <CardContent>
            <Typography
              variant="h6"
              color="primary"
              fontWeight="bold"
              align="center"
              sx={{ mb: 1, fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2rem' } }}
            >
              HỆ THỐNG ĐIỂM DANH BÁN TRÚ
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body1" paragraph sx={{ mt: 0, mb: 2 }}>
              Ứng dụng <strong>Quản lý Bán trú Trường Tiểu học Bình Khánh</strong> được phát triển nhằm hỗ trợ giáo viên và nhà trường trong việc quản lý học sinh bán trú, cập nhật số liệu và thống kê nhanh chóng, chính xác.
            </Typography>

            {/* Các phần còn lại giữ nguyên */}

            <Divider sx={{ my: 2 }} />

            {/* 🗓️ QUẢN LÝ DỮ LIỆU NGÀY */}
            <Typography variant="h6" color="primary" fontWeight="bold" sx={{ mt: 3, mb: 1 }}>
              🗓️ QUẢN LÝ DỮ LIỆU NGÀY
            </Typography>
            <Typography variant="body1" paragraph>
              📌 <strong>Chốt số liệu</strong><br />
              Ghi nhận danh sách học sinh ăn bán trú trong ngày hiện tại.
            </Typography>
            <Typography variant="body1" paragraph>
              📊 <strong>Số liệu trong ngày</strong><br />
              Xem nhanh sĩ số và số lượng học sinh ăn bán trú theo từng lớp trong ngày.
            </Typography>
            <Typography variant="body1" paragraph>
              🛠️ <strong>Điều chỉnh suất ăn</strong><br />
              Chỉnh sửa đăng ký suất ăn của học sinh trong từng ngày cụ thể.
            </Typography>
            <Typography variant="body1" paragraph>
              🗑️ <strong>Xóa dữ liệu theo ngày</strong><br />
              Xóa dữ liệu đã chốt của một ngày cụ thể (nếu cần cập nhật lại).
            </Typography>

            <Divider sx={{ my: 3 }} />

            {/* 📈 THỐNG KÊ */}
            <Typography variant="h6" color="primary" fontWeight="bold" sx={{ mb: 1 }}>
              📈 THỐNG KÊ
            </Typography>
            <Typography variant="body1" paragraph>
              🗓️ <strong>Thống kê theo ngày</strong><br />
              Tổng hợp số học sinh ăn bán trú theo từng lớp trong một ngày cụ thể.
            </Typography>
            <Typography variant="body1" paragraph>
              📅 <strong>Chi tiết từng tháng</strong><br />
              Thống kê chi tiết theo từng ngày trong tháng, hiển thị theo bảng.
            </Typography>
            <Typography variant="body1" paragraph>
              📚 <strong>Tổng hợp cả năm</strong><br />
              Tổng hợp số lần ăn bán trú của mỗi học sinh trong năm học.
            </Typography>

            <Divider sx={{ my: 3 }} />

            {/* 👥 DANH SÁCH HỌC SINH */}
            <Typography variant="h6" color="primary" fontWeight="bold" sx={{ mb: 1 }}>
              👥 DANH SÁCH HỌC SINH
            </Typography>
            <Typography variant="body1" paragraph>
              📥 <strong>Cập nhật danh sách</strong><br />
              Tải danh sách học sinh từ Excel để cập nhật dữ liệu lên hệ thống.
            </Typography>
            <Typography variant="body1" paragraph>
              📋 <strong>Lập danh sách bán trú</strong><br />
              Chọn học sinh đăng ký ăn bán trú từ danh sách hiện có, theo từng lớp.
            </Typography>
            <Typography variant="body1" paragraph>
              📤 <strong>Tải danh sách lên</strong><br />
              Tải file Excel từ máy để lưu trữ dữ liệu học sinh lên hệ thống.
            </Typography>

            <Divider sx={{ my: 3 }} />

            {/* ⚙️ QUẢN TRỊ HỆ THỐNG */}
            <Typography variant="h6" color="primary" fontWeight="bold" sx={{ mb: 1 }}>
              ⚙️ QUẢN TRỊ HỆ THỐNG
            </Typography>
            <Typography variant="body1" paragraph>
              🔐 <strong>Đăng nhập hệ thống</strong><br />
              Truy cập hệ thống với quyền quản trị để sử dụng đầy đủ các chức năng.
            </Typography>

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
