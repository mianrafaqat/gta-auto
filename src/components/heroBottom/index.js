"use client";

import { Box, Container, Typography, useTheme } from "@mui/material";
import React from "react";
import Iconify from "src/components/iconify";

const HeroBottom = ({ bgColor = "#000" }) => {
  const services = [
    {
      icon: "/assets/fastDelevery.svg",
      primaryText: "FASTED DELIVERY",
      secondaryText: "Delivery in 24/H",
    },
    {
      icon: "/assets/return.svg",
      primaryText: "24 HOURS RETURN",
      secondaryText: "100% money-back guarantee",
    },
    {
      icon: "/assets/scure.svg",
      primaryText: "SECURE PAYMENT",
      secondaryText: "Your money is safe",
    },
    {
      icon: "/assets/support.svg",
      primaryText: "SUPPORT 24/7",
      secondaryText: "Live contact/message",
    },
  ];

  return (
    <Box sx={{ bgcolor: bgColor, py: { xs: 2, sm: 3, md: 4 } }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: { xs: "flex-start", sm: "space-between" },
            alignItems: { xs: "stretch", sm: "center" },
            position: "relative",
            gap: { xs: 2, sm: 0 },
          }}>
          {services.map((service, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                flex: 1,
                px: { xs: 0, sm: 2 },
                py: { xs: 2, sm: 0 },
                position: "relative",
                "&:not(:last-child)::after": {
                  content: '""',
                  position: { xs: "static", sm: "absolute" },
                  right: 0,
                  top: "50%",
                  transform: { xs: "none", sm: "translateY(-50%)" },
                  width: { xs: 0, sm: "1px" },
                  height: { xs: 0, sm: "90%" },
                  bgcolor: "grey.600",
                  display: { xs: "none", sm: "block" },
                },
                borderBottom: {
                  xs: index !== services.length - 1 ? "1px solid #333" : "none",
                  sm: "none",
                },
              }}>
              {/* Icon */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: { xs: 40, sm: 48 },
                  height: { xs: 40, sm: 48 },
                  mr: 2,
                  flexShrink: 0,
                }}>
                <img
                  src={service.icon}
                  alt={service.primaryText}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </Box>

              {/* Text Content */}
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: "#4CAF50",
                    fontWeight: 500,
                    fontSize: { xs: "0.85rem", sm: "0.875rem" },
                    lineHeight: 1.2,
                    mb: 0.5,
                  }}>
                  {service.primaryText}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#fff",
                    fontSize: { xs: "0.72rem", sm: "0.75rem" },
                    lineHeight: 1.2,
                    mt: "8px",
                  }}>
                  {service.secondaryText}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default HeroBottom;
