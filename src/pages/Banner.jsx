// src/pages/Banner.jsx
import React from "react";
import { Box, Typography } from "@mui/material";

export default function Banner() {
  return (
    <Box
  sx={{
    width: "100%",
    height: { xs: 140, sm: 160, md: 200 },
    minHeight: 120,
    backgroundImage: "url('/banner.png')",
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    mb: 3,
    "&::before": {
      content: '""',
      position: "absolute",
      inset: 0,
      backgroundColor: "rgba(0, 0, 0, 0.3)",
      zIndex: 1,
    },
  }}
>

  <Box sx={{ position: "relative", zIndex: 2, textAlign: "center", px: 1 }}>
    <Typography
      variant="h5"
      color="white"
      fontWeight="bold"
      sx={{ fontSize: { xs: "1.2rem", sm: "1.6rem", md: "2.2rem" } }}
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
