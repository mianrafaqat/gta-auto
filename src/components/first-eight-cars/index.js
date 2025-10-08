"use client";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Button,
  Card,
  CardContent,
  Stack,
  Tabs,
  Tab,
  IconButton,
} from "@mui/material";
import React, { useState, useRef, useEffect } from "react";
import { useGetAllCars } from "src/hooks/use-cars";
import { useRouter } from "next/navigation";
import { WhatsApp } from "@mui/icons-material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Iconify from "src/components/iconify";
import { paths } from "src/routes/paths";
import GarageItem from "src/sections/garage/garage-item";

export default function LastestEightCars() {
  const { data: allCarsData, isLoading, error } = useGetAllCars();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const sliderRef = useRef(null);

  // Filter cars based on selected tab
  const getFilteredCars = () => {
    const baseCars =
      allCarsData?.data?.filter((c) => c?.status !== "Paused") || [];

    // First filter by sale category
    const saleCars = baseCars.filter(
      (car) => car.category?.toLowerCase() === "sale"
    );

    switch (activeTab) {
      case 0: // In Stock
        return saleCars.filter(
          (car) => car.status === "Active" || car.status === "In Stock"
        );
      case 1: // New Cars
        return saleCars.filter((car) => car.carDetails?.carType === "new");
      case 2: // Used Cars
        return saleCars.filter((car) => car.carDetails?.carType === "used");
      default:
        return saleCars;
    }
  };

  const filteredCars = getFilteredCars();

  // Calculate slidesToShow based on available cars
  const getSlidesToShow = (defaultValue) => {
    return Math.min(defaultValue, filteredCars.length);
  };

  // Check if we have only one car
  const isSingleCar = filteredCars.length === 1;

  const sliderSettings = {
    dots: false,
    infinite: filteredCars.length > 4,
    speed: 500,
    slidesToShow: getSlidesToShow(4),
    slidesToScroll: 1,
    autoplay: false,
    arrows: false, // Disable default arrows
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: getSlidesToShow(3),
          slidesToScroll: 1,
          arrows: false,
        },
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: getSlidesToShow(2),
          slidesToScroll: 1,
          arrows: false,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: getSlidesToShow(1),
          slidesToScroll: 1,
          arrows: false,
        },
      },
    ],
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Reset slider when tab changes
  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(0);
    }
  }, [activeTab, filteredCars.length]);

  if (isLoading) {
    return (
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "200px",
          }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "200px",
          }}>
          <Typography variant="h6" color="error">
            Error loading cars
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Box  sx={{
      py: 8,
      position: "relative",
      backgroundImage: "url(/assets/rentcar.webp)",
      backgroundSize: "cover",
      backgroundAttachment: "fixed",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1,
      },
    }}>
      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 2 }}>
        <Box sx={{ pb: "28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography
            variant="h3"
            sx={{
              color: "#4CAF50",
              fontWeight: "bold",
              fontSize: { xs: "28px", md: "36px" },
              mb: 1,
              width: "max-content",
            }}>
            Explore All Vehicles
          </Typography>
          
          {!isSingleCar && filteredCars.length > 0 && (
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                gap: 1,
              }}>
              <IconButton
                onClick={() => sliderRef.current?.slickPrev()}
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: "white",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  "&:hover": {
                    bgcolor: "#f5f5f5",
                    borderColor: "#999",
                  },
                }}>
                <Iconify
                  icon="eva:arrow-back-fill"
                  sx={{ fontSize: 18, color: "black" }}
                />
              </IconButton>
              <IconButton
                onClick={() => sliderRef.current?.slickNext()}
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: "white",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  "&:hover": {
                    bgcolor: "#f5f5f5",
                    borderColor: "#999",
                  },
                }}>
                <Iconify
                  icon="eva:arrow-forward-fill"
                  sx={{ fontSize: 18, color: "black" }}
                />
              </IconButton>
            </Box>
          )}
        </Box>
        {/* Tabs Navigation */}
        <Box
          sx={{ mb: 4, borderBottom: "1px solid #fff", position: "relative" }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              "& .MuiTabs-indicator": {
                bgcolor: "#4CAF50",
                height: 4,
                borderRadius: "1px",
                zIndex: 10,
                bottom: "-1px",
              },
              "& .MuiTab-root": {
                color: "#ffffff !important",
                fontSize: "1rem",
                fontWeight: 500,
                textTransform: "none",
                minWidth: 100,
                padding: "16px 24px",
                position: "relative",
                "&.Mui-selected": {
                  color: "#4CAF50 !important",
                  fontWeight: 600,
                },
                "&:hover": {
                  color: "#4CAF50",
                  backgroundColor: "rgba(76, 175, 80, 0.05)",
                },
              },
            }}>
            <Tab label="All" />
            <Tab label="New Cars" />
            <Tab label="Used Cars" />
          </Tabs>
        </Box>

        {/* Cars Display */}
        {filteredCars.length > 0 ? (
          <Box sx={{ mb: 6, position: "relative", width: "100%", pb: 8 }}>
            {isSingleCar ? (
              // Single car display - center it without full width
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                <Box sx={{ maxWidth: "350px", width: "100%" }}>
                  <GarageItem product={filteredCars[0]} />
                </Box>
              </Box>
            ) : (
              <>
                {/* Mobile View - Vertical Stack */}
                <Box
                  sx={{
                    display: { xs: "block", md: "none" },
                  }}>
                  <Stack spacing={3} alignItems="center">
                    {filteredCars.slice(0, 10).map((car) => (
                      <Box
                        key={car._id}
                        sx={{ width: "100%", maxWidth: "400px" }}>
                        <GarageItem product={car} />
                      </Box>
                    ))}
                  </Stack>
                </Box>

                {/* Desktop View - Slider */}
                <Box
                  sx={{
                    display: { xs: "none", md: "block" },
                  }}>
                  <Slider
                    key={`slider-${activeTab}-${filteredCars.length}`}
                    ref={sliderRef}
                    {...sliderSettings}
                    style={{ width: "100%", display: "flex !important" }}>
                    {filteredCars.slice(0, 10).map((car) => (
                      <Box
                        key={car._id}
                        sx={{ px: 1, display: "flex !important" }}>
                        <GarageItem product={car} />
                      </Box>
                    ))}
                  </Slider>
                </Box>
              </>
            )}
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "200px",
            }}>
            <Typography variant="h6" color="grey.400">
              No cars found
            </Typography>
          </Box>
        )}

        {/* WhatsApp Import Section */}
      </Container>
    </Box>
  );
}
