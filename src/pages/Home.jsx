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
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(to bottom, #e3f2fd, #bbdefb)", py: 6, px: 2 }}>
      <Typography variant="h4" align="center" gutterBottom fontWeight="bold" color="primary" sx={{ borderBottom: "3px solid #1976d2", pb: 1, mb: 4 }}>
        ĐIỂM DANH BÁN TRÚ
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {khốiList.map((label, index) => (
          <Grid item xs={12} sm={6} md={4} key={label}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.2 }}>
              <Card elevation={6} sx={{ borderRadius: 3, overflow: "hidden", textAlign: "center", height: "100%" }}>
                <Box sx={{ bgcolor: "#fff", display: "flex", justifyContent: "center", alignItems: "center", p: 2, cursor: "pointer" }}
                  onClick={() => navigate(`/lop${index + 1}`, { state: { useNewVersion } })}
                >
                  <img src={`/${imageList[index]}`} alt={label} width="140px" height="140px" style={{ borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }} />
                </Box>

                <CardContent>
                  <Typography variant="h6" fontWeight="600" gutterBottom>{label}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Nhấn để xem danh sách lớp {index + 1}
                  </Typography>

                  <Button variant="contained" fullWidth sx={{ backgroundColor: colorMap[index], fontWeight: 600, "&:hover": { backgroundColor: colorMap[index], filter: "brightness(0.9)" }}}
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