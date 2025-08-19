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
      {/* Background Car Image */}
      {/* <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "url(/assets/chemical-bg.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: 1,
        }}
      /> */}

      <Box sx={{ height: "100%", objectFit: "cover" }}>
        <img src="/assets/chemical-bg.png" alt="chemical-bg" />
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
