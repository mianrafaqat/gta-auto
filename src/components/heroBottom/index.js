"use client";

import { Box, Container, Typography } from "@mui/material";
import React from "react";
import Iconify from "src/components/iconify";

const HeroBottom = () => {
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
    <Box sx={{ bgcolor: "black", py: 4 }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "relative",
          }}>
          {services.map((service, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                flex: 1,
                px: 2,
                position: "relative",
                "&:not(:last-child)::after": {
                  content: '""',
                  position: "absolute",
                  right: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "1px",
                  height: "90%",
                  bgcolor: "grey.600",
                },
              }}>
              {/* Icon */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 48,
                  height: 48,
                  mr: 2,
                }}>
                <img src={service.icon} alt={service.primaryText} />
              </Box>

              {/* Text Content */}
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: "#4CAF50",
                    fontWeight: 500,
                    fontSize: "0.875rem",
                    lineHeight: 1.2,
                    mb: 0.5,
                  }}>
                  {service.primaryText}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#fff",
                    fontSize: "0.75rem",
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
