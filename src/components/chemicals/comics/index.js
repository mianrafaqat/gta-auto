import { Box, Button, Typography } from "@mui/material";
import React from "react";

const Comics = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `url('/assets/chomic_bg.jpeg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative",
        my: "32px",
      }}>
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          minHeight: "100vh",
          height: "100%",
          bgcolor: "#000",
          opacity: 0.5,
          p: 3,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}></Box>
      <Box
        position="relative"
        zIndex={99}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          flexDirection: "column",
          gap: "16px",
        }}>
        <Typography variant="h1" sx={{ color: "#4caf50", textAlign: "center" }}>
          GTA COMICS
        </Typography>
        <Button variant="contained" color="primary">
          View Here
        </Button>
      </Box>
    </Box>
  );
};

export default Comics;
