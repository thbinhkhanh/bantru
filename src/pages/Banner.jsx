// src/pages/Banner.jsx
import React from "react";
import { Box, Typography } from "@mui/material";

export default function Banner() {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: { xs: 120, sm: 160, md: 200 },
        backgroundImage: "url('/banner.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        //mt: '20px',
        mb: 3,
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          zIndex: 1,
        },
      }}
    >
      <Box sx={{ position: "relative", zIndex: 2, textAlign: "center", px: 1 }}>
        <Typography
          variant="h5"
          color="white"
          fontWeight="bold"
          sx={{ fontSize: { xs: "1.2rem", sm: "1.5rem", md: "2.5rem" } }}
        >
          ĐIỂM DANH BÁN TRÚ
        </Typography>
        <Typography
          variant="subtitle2"
          color="white"
          sx={{ fontSize: { xs: "0.8rem", sm: "1rem" } }}
        >
          {/* Quản lý điểm danh bán trú */}
        </Typography>
      </Box>
    </Box>
  );
}
