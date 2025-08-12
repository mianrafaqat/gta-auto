"use client";

import { Box, Typography, Stack, Avatar } from "@mui/material";
import React from "react";
import Iconify from "src/components/iconify";

const Washing = () => {
  const features = [
    "Our 250,000 cleans",
    " High-performance automotive chemicals designed to boost your vehicle's efficiency and extend its life.",
    "From engine oils to brake fluids — we've got your vehicle covered.",
  ];

  return (
    <Box sx={{ py: 8, px: 2 }}>
      <Box
        sx={{
          mx: "auto",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
          alignItems: "center",
        }}>
        {/* Left Section - Text Content */}
        <Box
          sx={{
            flex: 1,
            pr: { md: 4 },
          }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "32px", md: "42px" },
              fontWeight: 700,
              color: "#000",
              mb: 1,
              lineHeight: 1.2,
              color: "white",
            }}>
            Professional Washing
            <br />
            and Cleaning Car
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontSize: "16px",
              color: "#333",
              mb: 4,
              lineHeight: 1.6,
              color: "white",
            }}>
            Professional Washing and Cleaning Car automotive solution. With a
            passion for performance and a commitment to quality, we specialize
            in providing top-grade automotive chemicals, genuine auto parts,
            easy vehicle listings, and hassle-free car imports.
          </Typography>

          {/* Features List */}
          <Stack spacing={2} sx={{ mb: 4 }}>
            {features.map((feature, index) => (
              <Box
                key={index}
                sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    backgroundColor: "#4caf50",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                  <Iconify
                    icon="eva:checkmark-fill"
                    sx={{
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  />
                </Box>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: "16px",
                    color: "#fff",
                    fontWeight: 500,
                  }}>
                  {feature}
                </Typography>
              </Box>
            ))}
          </Stack>

          {/* Contact Section */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            {/* Team Avatars */}
            <Stack direction="row">
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  border: "2px solid #fff",
                  bgcolor: "#1976d2",
                }}>
                <Iconify icon="eva:person-fill" />
              </Avatar>
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  border: "2px solid #fff",
                  bgcolor: "#2e7d32",
                  marginLeft: "-10px",
                }}>
                <Iconify icon="eva:person-fill" />
              </Avatar>
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  border: "2px solid #fff",
                  bgcolor: "#ed6c02",
                  marginLeft: "-10px",
                }}>
                <Iconify icon="eva:person-fill" />
              </Avatar>
            </Stack>

            {/* Contact Info */}
            <Stack>
              <Typography
                variant="body2"
                sx={{
                  color: "#fff",
                  fontSize: "14px !important",
                }}>
                24 Hours Service Available
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "12px !important",
                }}>
                Booking: <span style={{ color: "#4caf50" }}>+923263333456</span>
              </Typography>
            </Stack>
          </Box>
        </Box>

        {/* Right Section - Image */}
        <Box
          sx={{
            flex: 1,
            position: "relative",
          }}>
          <Box
            sx={{
              width: "100%",
              height: { xs: "300px", md: "500px" },
              borderRadius: "16px",
              overflow: "hidden",
              backgroundImage:
                "url(https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=500&fit=crop&crop=center)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              position: "relative",
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: 0,
                right: 0,
                width: "100px",
                height: "100px",
                background: "linear-gradient(45deg, transparent 50%, #fff 50%)",
                borderRadius: "0 0 16px 0",
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Washing;
