"use client";
import React from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  Avatar,
  Rating,
  Chip,
} from "@mui/material";
import { ArrowForward, Star } from "@mui/icons-material";

const HeroBanner = () => {
  // Navigation buttons data
  const navButtons = [
    "Carwash",
    "Ceramic",
    "Car Shine",
    "Shine",
    "Wheel scratch",
    "Auto Detailing",
  ];

  // Customer avatars for testimonials
  const customerAvatars = [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
  ];

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
        overflow: "hidden",
      }}>
      {/* Background Car Image */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage:
            "url(https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.7,
          zIndex: 1,
        }}
      />

      {/* Main Content */}
      <Container
        maxWidth="xl"
        sx={{
          position: "relative",
          zIndex: 3,
          height: "calc(100vh - 80px)",
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
          }}>
          {/* {navButtons.map((button, index) => (
            <Chip
              key={index}
              label={button}
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                color: "#333",
                fontWeight: 600,
                fontSize: "0.9rem",
                padding: "8px 16px",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 1)",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s ease",
              }}
            />
          ))} */}
        </Box>
      </Container>
    </Box>
  );
};

export default HeroBanner;
