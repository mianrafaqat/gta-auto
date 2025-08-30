"use client";
import React from "react";
import { Box, Container } from "@mui/material";

const HeroBanner = () => {
  return (
    <Box
      sx={{
        position: "relative",
        height: "calc(100vh - 80px)",
        overflow: "hidden",
      }}>
      <Box sx={{ height: "100%", objectFit: "cover", width: "100%" }}>
        <img
          src="/assets/chemical-bg.jpeg"
          alt="chemical-bg"
          style={{ width: "100%" }}
        />
      </Box>

      {/* Main Content */}
      <Container
        maxWidth="xl"
        sx={{
          position: "relative",
          zIndex: 3,
          // height: "calc(100vh - 80px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}>
        {/* Navigation Buttons */}
        <Box
          sx={{
            position: "absolute",
            top: "20%",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            justifyContent: "center",
            maxWidth: "600px",
          }}></Box>
      </Container>
    </Box>
  );
};

export default HeroBanner;
