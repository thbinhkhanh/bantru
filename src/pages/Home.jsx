import React, { useState, useEffect } from "react";
import {
  Box, Grid, Typography, Card, CardContent, Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

export default function Home() {
  const navigate = useNavigate();
  const [useNewVersion, setUseNewVersion] = useState(false);

  useEffect(() => {
    const fetchToggle = async () => {
      try {
        const toggleSnap = await getDoc(doc(db, "SETTINGS", "TOGGLE"));
        if (toggleSnap.exists()) {
          setUseNewVersion(toggleSnap.data().useNewVersion === true);
        }
      } catch (error) {
        console.error("❌ Lỗi khi tải trạng thái toggle:", error);
      }
    };
    fetchToggle();
  }, []);

  const khốiList = ["KHỐI 1", "KHỐI 2", "KHỐI 3", "KHỐI 4", "KHỐI 5"];
  const imageList = ["L1.png", "L2.png", "L3.png", "L4.png", "L5.png"];
  const colorMap = ["#42a5f5", "#66bb6a", "#ffb300", "#ab47bc", "#ef5350"];

  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(to bottom, #e3f2fd, #bbdefb)", py: 0, px: 2 }}>
      {/* Banner: giảm chiều cao xuống ví dụ xs:100, sm:150, md:200 */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: { xs: 100, sm: 150, md: 200 },  // Điều chỉnh nhỏ hơn
          backgroundImage: "url('/Banner.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 3,  // khoảng cách dưới banner
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
          {/* Nếu banner nhỏ, cân nhắc giảm size chữ */}
          <Typography variant="h5" color="white" fontWeight="bold" sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2.5rem' } }}>
            ĐIỂM DANH BÁN TRÚ
          </Typography>
          <Typography variant="subtitle2" color="white" sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}>
            {/*Quản lý điểm danh bán trú*/}
          </Typography>
        </Box>
      </Box>

      {/* Tiêu đề chính nếu vẫn muốn hiển thị */}
      <Typography
        variant="h6"
        align="center"
        gutterBottom
        fontWeight="bold"
        color="primary"
        sx={{ borderBottom: "3px solid #1976d2", pb: 1, mb: 4 }}
      >
        {/*ĐIỂM DANH BÁN TRÚ*/}
      </Typography>

      <Grid container spacing={3} justifyContent="center" sx={{ mb: 4 }}>
        {khốiList.map((label, index) => (
          <Grid item xs={12} sm={6} md={4} key={label}>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
            >
              <Card
                elevation={4}
                sx={{ borderRadius: 2, overflow: "hidden", textAlign: "center", height: "100%" }}
              >
                <Box
                  sx={{
                    bgcolor: "#fff",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    p: 1.5,
                    cursor: "pointer"
                  }}
                  onClick={() => navigate(`/lop${index + 1}`, { state: { useNewVersion } })}
                >
                  <img
                    src={`/${imageList[index]}`}
                    alt={label}
                    width="120px"
                    height="120px"
                    style={{ borderRadius: "8px", boxShadow: "0 3px 8px rgba(0,0,0,0.1)" }}
                  />
                </Box>

                <CardContent sx={{ py: 1 }}>
                  <Typography variant="h6" fontWeight="600" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                    {label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
                    Nhấn để xem danh sách lớp {index + 1}
                  </Typography>

                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      backgroundColor: colorMap[index],
                      fontWeight: 600,
                      py: { xs: 0.5, sm: 1 },
                      fontSize: { xs: '0.8rem', sm: '0.9rem' },
                      "&:hover": { backgroundColor: colorMap[index], filter: "brightness(0.9)" }
                    }}
                    onClick={() => navigate(`/lop${index + 1}`, { state: { useNewVersion } })}
                  >
                    Vào {label}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
