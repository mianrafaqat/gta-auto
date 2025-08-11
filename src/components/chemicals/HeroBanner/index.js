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
          height: "100vh",
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
          {navButtons.map((button, index) => (
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
          ))}
        </Box>

        <Box
          sx={{
            position: "absolute",
            bottom: "10%",
            left: "5%",
            right: "5%",
            display: "flex",
            gap: 3,
            justifyContent: "space-between",
            flexWrap: { xs: "wrap", lg: "nowrap" },
          }}>
          {/* Left Card - Customer Focus */}
          <Card
            sx={{
              flex: { xs: "1 1 100%", md: "1 1 30%" },
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              borderRadius: 3,
              backdropFilter: "blur(10px)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "translateY(-5px)",
              },
            }}>
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: "#333",
                  mb: 2,
                  lineHeight: 1.4,
                }}>
                Our Customers are the most important part of our business
              </Typography>
              <Button
                endIcon={<ArrowForward />}
                sx={{
                  color: "#667eea",
                  fontWeight: 600,
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "rgba(102, 126, 234, 0.1)",
                  },
                }}>
                Read More
              </Button>
            </CardContent>
          </Card>

          {/* Right Card - Reviews & Rating */}
          <Card
            sx={{
              flex: { xs: "1 1 100%", md: "1 1 35%" },
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              borderRadius: 3,
              backdropFilter: "blur(10px)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "translateY(-5px)",
              },
            }}>
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="body1"
                sx={{
                  color: "#333",
                  mb: 2,
                  lineHeight: 1.5,
                  fontSize: "0.95rem",
                }}>
                Our professional and reliable car cleaners provide thorough Car
                Detailing, Interior Deep Cleaning
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 900,
                    color: "#333",
                    mr: 2,
                  }}>
                  4.6
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#666",
                    fontWeight: 500,
                  }}>
                  150k happy guests
                </Typography>
              </Box>

              {/* Customer Avatars */}
              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                {customerAvatars.map((avatar, index) => (
                  <Avatar
                    key={index}
                    src={avatar}
                    sx={{
                      width: 32,
                      height: 32,
                      border: "2px solid white",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  />
                ))}
              </Stack>

              {/* Rating Stars */}
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Rating
                  value={5}
                  readOnly
                  sx={{
                    "& .MuiRating-iconFilled": {
                      color: "#FFD700",
                    },
                  }}
                />
              </Box>

              <Typography
                variant="body2"
                sx={{
                  color: "#666",
                  fontWeight: 500,
                }}>
                18,922 reviews
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Container>

      {/* CSS Animation for steam effect */}
      <style jsx>{`
        @keyframes steam {
          0%,
          100% {
            opacity: 0.3;
            transform: translateY(0) scale(1);
          }
          50% {
            opacity: 0.8;
            transform: translateY(-10px) scale(1.2);
          }
        }
      `}</style>
    </Box>
  );
};

export default HeroBanner;
