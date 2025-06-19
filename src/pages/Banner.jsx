// src/components/Banner.jsx
import React from 'react';
import { Box, Typography, Button } from '@mui/material';

export default function Banner({
  title = "Chào mừng đến với Ứng dụng của tôi",
  subtitle = "Đây là mô tả ngắn",
  backgroundImage, // URL hoặc null để dùng màu nền
  height = { xs: 200, sm: 300, md: 400 }, // chiều cao responsive
  overlayColor = "rgba(0,0,0,0.4)", // màu overlay để text dễ đọc
  buttonText,
  onButtonClick,
}) {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: height,
        backgroundColor: backgroundImage ? "transparent" : "#1976d2",
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        // nếu muốn overlay tối:
        "&::before": backgroundImage
          ? {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: overlayColor,
              zIndex: 1,
            }
          : {},
      }}
    >
      {/* Nội dung bên trong, đặt zIndex cao hơn overlay */}
      <Box sx={{ position: "relative", zIndex: 2, textAlign: "center", px: 2 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: "bold", mb: 1 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="subtitle1" sx={{ mb: buttonText ? 2 : 0 }}>
            {subtitle}
          </Typography>
        )}
        {buttonText && onButtonClick && (
          <Button variant="contained" color="secondary" onClick={onButtonClick}>
            {buttonText}
          </Button>
        )}
      </Box>
    </Box>
  );
}
