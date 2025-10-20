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
    <Box sx={{ py: 8, px: 2, }}>
      <Box
        sx={{
          mx: "auto",
          display: "flex",
          flexDirection: { xs: "column-reverse",  sm: "column-reverse", md: "row" } ,
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
           Who we are
          
          </Typography>
          <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, mb: 3, color: '#e0e0e0' }}>
            Welcome to <strong style={{ color: '#25D366' }}>Garage Tuned Autos</strong> — your all-in-one destination for premium automotive care, performance, and passion.
          </Typography>

          <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, mb: 1, color: '#e0e0e0' }}>
            At Garage Tuned Autos, we specialize in professional car tuning, detailing, repairs, and maintenance services, helping every vehicle reach its peak performance and appearance. From engine tuning and diagnostics to ceramic coating, detailing, and custom modifications, our expert technicians bring precision, experience, and innovation to every job.
          </Typography>

          <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, mb: 1, color: '#e0e0e0' }}>
            We're also proud to offer a wide range of high-quality automotive chemicals and care products, including engine oils, detailing supplies, and performance additives — trusted by professionals and car lovers alike for reliability and results.
          </Typography>

          <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, mb: 1, color: '#e0e0e0' }}>
            But that's not all — we go beyond the workshop! Explore our Car Listings section to buy or sell vehicles with confidence, and check out our Car Rental Service to experience top-tier cars for daily drives, business needs, or special occasions.
          </Typography>

          <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, mb: 2, color: '#e0e0e0' }}>
            At Garage Tuned Autos, we don't just maintain cars — we build trust, performance, and a community of passionate drivers.
          </Typography>

          <Typography 
            variant="h5" 
            sx={{ 
              color: '#25D366', 
              fontWeight: 700,
              textAlign: 'center',
              fontStyle: 'italic'
            }}
          >
            Garage Tuned Autos — Tuned for Performance, Built for You.
          </Typography>
          {/* <Typography
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
          </Typography> */}

          {/* Features List */}
          {/* <Stack spacing={2} sx={{ mb: 4 }}>
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
          </Stack> */}

          {/* Contact Section */}
          {/* <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
           
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
          </Box> */}
        </Box>

        {/* Right Section - Image */}
        <Box
          sx={{
            width: { xs: "100%", md: "50%" },
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
                "url(/assets/cetificate-chemicals.jpeg)",
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              position: "relative",
              
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Washing;
