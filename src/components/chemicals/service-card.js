"use client";

import { Box, Typography, Button } from "@mui/material";
import React from "react";

const ServiceCard = ({ image, title, onClick }) => {
  return (
    <Box
      sx={{
        position: "relative",
        maxWidth: "calc(25% - 24px)",
        width: "100%",
        height: "400px",
        borderRadius: "16px",
        overflow: "hidden",
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        "&:hover": {
          transform: "scale(1.02)",
          transition: "transform 0.3s ease-in-out",
        },
      }}>
      {/* Book Now Button */}
      <Box sx={{ p: 2 }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#fff",
            color: "#000",
            borderRadius: "36px",
            textTransform: "none",
            fontWeight: 600,
            fontSize: "14px",
            px: 2,
            py: 1,
            "&:hover": {
              backgroundColor: "#f5f5f5",
            },
          }}
          onClick={onClick}>
          Book Now
        </Button>
      </Box>

      {/* Text Overlay */}
      <Box
        sx={{
          background: "linear-gradient(transparent, rgba(0, 0, 0, 0.7))",
          p: 3,
          minHeight: "120px",
          display: "flex",
          alignItems: "flex-end",
        }}>
        <Typography
          variant="h4"
          sx={{
            color: "#fff",
            fontWeight: 700,
            fontSize: "32px !important",
            lineHeight: 1.2,
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
          }}>
          {title}
        </Typography>
      </Box>
    </Box>
  );
};

export default ServiceCard;
