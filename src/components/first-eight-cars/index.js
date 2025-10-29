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
      allCarsData?.data?.filter((c) => c?.status !== "Paused" && c?.carDetails?.isFeatured) || [];

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
    dots: true,
    infinite: true, // Always enable infinite scrolling for unlimited scrolling
    speed: 500,
    slidesToShow: getSlidesToShow(4),
    slidesToScroll: 1, // Always scroll one slide at a time for smooth unlimited scrolling
    autoplay: false,
    arrows: false, // We use custom arrows
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: getSlidesToShow(3),
          slidesToScroll: 1, // Always scroll one slide at a time
          arrows: false,
        },
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: getSlidesToShow(2),
          slidesToScroll: getSlidesToShow(2), // Scroll by visible slides (2 at a time on mobile)
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
      py: {xs: 2, md: 8},
      position: "relative",
      backgroundImage: {xs: "unset", md: "url(/assets/rentcar.webp)"},
      backgroundSize: {xs: "unset", md: "cover"},
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
        backgroundColor: {xs: "unset", md: "rgba(0, 0, 0, 0.5)"},
        zIndex: 1,
      },
    }}>
      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 2 }}>
        <Box sx={{ pb: {xs: 0, md: "28px"}, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%", justifyContent: "space-between"}}>
          <Typography
            variant="h3"
            sx={{
              color: "#4CAF50",
              fontWeight: "bold",
              fontSize: { xs: "18px", md: "36px" },
              mb: 1,
              width: "max-content",
            }}>
            Explore All Vehicles
          </Typography>
          <Typography
            component="a"
            href="/cars"
            sx={{
              color: "#4caf50",
              textDecoration: "none",
              fontWeight: "bold",
              fontSize: {xs: "12px", md: "16px"},
              "&:hover": {
                textDecoration: "underline",
              },
            }}>
            View All Cars
          </Typography>   
          </Box>       
          {!isSingleCar && filteredCars.length > getSlidesToShow(4) && (
            <Box
              sx={{
                display: "flex",
                gap: 1,
              }}>
              <IconButton
                onClick={() => sliderRef.current?.slickPrev()}
                sx={{
                  width: { xs: 36, md: 40 },
                  height: { xs: 36, md: 40 },
                  bgcolor: "white",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  display: { xs: "none", md: "flex" },
                  "&:hover": {
                    bgcolor: "#f5f5f5",
                    borderColor: "#999",
                  },
                }}>
                <Iconify
                  icon="eva:arrow-back-fill"
                  sx={{ fontSize: { xs: 16, md: 18 }, color: "black" }}
                />
              </IconButton>
              <IconButton
                onClick={() => sliderRef.current?.slickNext()}
                sx={{
                  width: { xs: 36, md: 40 },
                  height: { xs: 36, md: 40 },
                  bgcolor: "white",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  display: { xs: "none", md: "flex" },
                  "&:hover": {
                    bgcolor: "#f5f5f5",
                    borderColor: "#999",
                  },
                }}>
                <Iconify
                  icon="eva:arrow-forward-fill"
                  sx={{ fontSize: { xs: 16, md: 18 }, color: "black" }}
                />
              </IconButton>
            </Box>
          )}
        </Box>
        {/* Tabs Navigation */}
        <Box
          sx={{ 
            mb: { xs: 2, md: 4 }, 
            borderBottom: "1px solid #fff", 
            position: "relative", 
            p: 0,
            overflow: "hidden"
          }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              "& .MuiTabs-indicator": {
                bgcolor: "#4CAF50",
                height: { xs: 2, md: 4 },
                borderRadius: { xs: 1, md: 1 },
                zIndex: 10,
                bottom: "-1px",
              },
              "& .MuiTabs-scrollButtons": {
                color: "#4CAF50",
                "&.Mui-disabled": {
                  opacity: 0.3,
                },
              },
              "& .MuiTab-root": {
                color: "#ffffff !important",
                fontSize: { xs: "11px", sm: "13px", md: "1rem" },
                fontWeight: 500,
                textTransform: "none",
                minWidth: { xs: 80, sm: 100, md: 120 },
                maxWidth: { xs: 120, sm: 150, md: "none" },
                padding: { 
                  xs: "8px 12px", 
                  sm: "10px 16px", 
                  md: "16px 24px" 
                },
                position: "relative",
                whiteSpace: "nowrap",
                "&.Mui-selected": {
                  color: "#4CAF50 !important",
                  fontWeight: 600,
                },
                "&:hover": {
                  color: "#4CAF50",
                  backgroundColor: "rgba(76, 175, 80, 0.05)",
                },
              },
              "& .MuiTabs-flexContainer": {
                gap: { xs: 0, sm: 1 },
              },
            }}>
            <Tab label="All" />
            <Tab label="New Cars" />
            <Tab label="Used Cars" />
          </Tabs>
        </Box>

        {/* Cars Display */}
        {filteredCars.length > 0 ? (
          <Box sx={{ mb: {md: 6, xs: 0}, position: "relative", width: "100%", pb: {md: 8, xs: 0}, overflow: "visible" }}>
            {isSingleCar ? (
              // Single car display - center it without full width
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  p: 0,
                }}>
                <Box sx={{ maxWidth: {xs: "180px", md: "350px"}, width: "100%", p: 0 }}>
                  <GarageItem product={filteredCars[0]} />
                </Box>
              </Box>
            ) : (
              <>
                {/* Mobile Grid Layout - 2x2 (4 cards) */}
                {/* <Box
                  sx={{
                    display: { xs: "grid", md: "none" },
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: 2,
                    mb: 4,
                    p: 0,
                  }}>
                  {filteredCars.slice(0, 4).map((car) => (
                    <Box key={car._id}>
                      <GarageItem product={car} />
                    </Box>
                  ))}
                </Box> */}

                {/* Mobile Horizontal Scroll Layout */}
                <Box
                  sx={{
                    display: { xs: "flex", md: "none" },
                    overflowX: "auto",
                    overflowY: "hidden",
                    width: "100%",
                    gap: 2,
                    py: 1,
                    px: 1,
                    scrollSnapType: "x mandatory",
                    "&::-webkit-scrollbar": {
                      display: "none",
                    },
                    scrollbarWidth: "none",
                    WebkitOverflowScrolling: "touch",
                    msOverflowStyle: "none",
                  }}>
                  {filteredCars.map((car) => (
                    <Box
                      key={car._id}
                      sx={{
                        minWidth: "45vw",
                        maxWidth: "15vw",
                        width: "45vw",
                        flexShrink: 0,
                        scrollSnapAlign: "start",
                      }}>
                      <GarageItem product={car} />
                    </Box>
                  ))}
                </Box>

                {/* Desktop Slider Layout */}
                <Box
                  sx={{
                    display: { xs: "none", md: "block" },
                    "& .slick-slide": {
                      display: "flex",
                      justifyContent: "center",
                      "& > div": {
                        width: "100%",
                      },
                    },
                    "& .slick-list": {
                      margin: "0 -8px",
                    },
                    "& .slick-slide > div": {
                      // padding: "0 8px",
                      display: "flex",
                    },
                    "& .slick-dots": {
                      bottom: "-50px",
                      "& li button:before": {
                        color: "#4CAF50",
                        fontSize: "12px",
                        opacity: 0.3,
                      },
                      "& li.slick-active button:before": {
                        opacity: 1,
                        color: "#4CAF50",
                      },
                    },
                  }}>
                  <Slider
                    key={`slider-${activeTab}-${filteredCars.length}`}
                    ref={sliderRef}
                    {...sliderSettings}>
                    {filteredCars.map((car) => (
                      <div key={car._id}>
                        <Box sx={{  height: "100%", display: "flex" }}>
                          <GarageItem product={car} />
                        </Box>
                      </div>
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
