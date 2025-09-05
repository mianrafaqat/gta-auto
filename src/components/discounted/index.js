import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import Iconify from "../iconify";

const Discounted = () => {
  const discountedItems = [
    {
      id: 1,
      category: "Steering Covers",
      discount: "Up to 50% Off",
      icon: "mdi:steering",
      color: "#FF6B6B",
    },
    {
      id: 2,
      category: "Car Locks",
      discount: "Up to 50% Off",
      icon: "mdi:lock",
      color: "#4ECDC4",
    },
    {
      id: 3,
      category: "Silicon key covers",
      discount: "Up to 50% Off",
      icon: "mdi:key",
      color: "#45B7D1",
    },
    {
      id: 4,
      category: "Internal PPF Kit",
      discount: "Up to 50% Off",
      icon: "mdi:shield-check",
      color: "#96CEB4",
    },
    {
      id: 5,
      category: "Ambience Light",
      discount: "Up to 50% Off",
      icon: "mdi:lightbulb",
      color: "#FFEAA7",
    },
    {
      id: 6,
      category: "Seat Belt Knobs",
      discount: "Up to 50% Off",
      icon: "mdi:seatbelt",
      color: "#DDA0DD",
    },
  ];

  return (
    <Box
      sx={{
        backgroundColor: "#000",
        py: 8,
      }}>
      <Container maxWidth="xl">
        {/* Section Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 4,
          }}>
          <Box sx={{ borderBottom: "1px solid #4caf50", pb: "36px" }}>
            <Typography
              variant="h3"
              sx={{
                color: "#4caf50",
                fontWeight: "bold",
                fontSize: { xs: "24px", md: "32px" },
                mb: 1,
              }}>
              Discounted must haves
            </Typography>
          </Box>

          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              flexDirection: "column",
              gap: 0.5,
            }}>
            <Typography
              component="a"
              href="/discounted"
              sx={{
                color: "rgba(255, 255, 255, 0.7)",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                "&:hover": {
                  color: "#4caf50",
                },
              }}>
              View All
              <Iconify
                icon="mdi:arrow-right"
                sx={{
                  fontSize: "16px",
                }}
              />
            </Typography>
          </Box>
        </Box>

        {/* Product Cards Grid */}
        {/* Responsive: Grid on desktop, horizontal scroll (slide) on mobile */}
        <Box
          sx={{
            display: { xs: "block", md: "none" },
            overflowX: "auto",
            whiteSpace: "nowrap",
            pb: 1,
            mb: 2,
            // Hide scrollbar for Webkit browsers
            "&::-webkit-scrollbar": { display: "none" },
            "-ms-overflow-style": "none",
            "scrollbar-width": "none",
          }}>
          {discountedItems.map((item) => (
            <Box
              key={item.id}
              sx={{
                display: "inline-block",
                verticalAlign: "top",
                width: "180px",
                mx: 1,
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                },
              }}>
              {/* Product Icon with Green Border */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                  position: "relative",
                }}>
                {/* Icon Container with Background Color */}
                <Box
                  sx={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    backgroundColor: "#4caf50",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  }}>
                  <Iconify
                    icon={item.icon}
                    sx={{
                      fontSize: "100px",
                      color: "#ffffff",
                      filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
                    }}
                  />
                </Box>
              </Box>
              {/* Product Details - Below Image */}
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#ffffff",
                    fontWeight: "500",
                    fontSize: "12px !important",
                    mb: 0.5,
                    lineHeight: 1.3,
                  }}>
                  {item.category}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#4caf50",
                    fontWeight: "500",
                    fontSize: "16px",
                  }}>
                  {item.discount}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Desktop grid view */}
        <Grid
          container
          spacing={3}
          sx={{ display: { xs: "none", md: "flex" } }}>
          {discountedItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={2} key={item.id}>
              <Box
                sx={{
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                  },
                }}>
                {/* Product Icon with Green Border */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                    position: "relative",
                  }}>
                  {/* Icon Container with Background Color */}
                  <Box
                    sx={{
                      width: "260px",
                      height: "280px",
                      borderRadius: "16px",
                      backgroundColor: "#4caf50",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    }}>
                    <Iconify
                      icon={item.icon}
                      // fontSize="100px"
                      width="90px"
                      height="90px"
                      sx={{
                        fontSize: "100px",
                        color: "#ffffff",
                        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
                      }}
                    />
                  </Box>
                </Box>

                {/* Product Details - Below Image */}
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#ffffff",
                      fontWeight: "500",
                      fontSize: "12px !important",
                      mb: 0.5,
                      lineHeight: 1.3,
                    }}>
                    {item.category}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#4caf50",
                      fontWeight: "500",
                      fontSize: "16px",
                    }}>
                    {item.discount}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Discounted;
