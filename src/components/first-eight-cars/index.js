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

export default function LastestEightCars() {
  const { data: allCarsData, isLoading, error } = useGetAllCars();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const sliderRef = useRef(null);

  // Filter cars based on selected tab
  const getFilteredCars = () => {
    const baseCars =
      allCarsData?.data?.filter((c) => c?.status !== "Paused") || [];

    switch (activeTab) {
      case 0: // In Stock
        return baseCars.filter(
          (car) => car.status === "Active" || car.status === "In Stock"
        );
      case 1: // New Cars
        return baseCars.filter((car) => car.carDetails?.carType === "new");
      case 2: // Used Cars
        return baseCars.filter((car) => car.carDetails?.carType === "used");
      default:
        return baseCars;
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

  // Car Card Component
  const CarCard = ({ car }) => {
    const getBadgeType = () => {
      if (car.deal === "great") return { type: "Great Deal", color: "#4CAF50" };
      if (car.deal === "fair") return { type: "Fair Deal", color: "#2196F3" };
      if (car.deal === "good") return { type: "Good Deal", color: "#FF9800" };
      return null;
    };

    const badge = getBadgeType();

    return (
      <Card
        sx={{
          bgcolor: "white",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          minHeight: "400px",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            transition: "all 0.3s ease",
          },
        }}>
        {/* Car Image */}
        <Box sx={{ position: "relative", height: 200 }}>
          <img
            src={
              car.image?.[0] || car.coverUrl || "/assets/placeholder-car.jpg"
            }
            alt={car.title || car.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />

          {/* Badge */}
          {badge && (
            <Box
              sx={{
                position: "absolute",
                top: 12,
                left: 12,
                bgcolor: badge.color,
                color: "white",
                px: 1.5,
                py: 0.5,
                borderRadius: "12px",
                fontSize: "0.75rem",
                fontWeight: 600,
              }}>
              {badge.type}
            </Box>
          )}

          {/* Favorite Icon */}
          <IconButton
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              bgcolor: "white",
              width: 32,
              height: 32,
              "&:hover": {
                bgcolor: "grey.100",
              },
            }}>
            <Iconify icon="eva:heart-outline" sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>

        {/* Car Details */}
        <CardContent
          sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Title */}
          <Typography
            variant="h6"
            noWrap
            sx={{
              fontWeight: 500,
              color: "black",
              mb: "0px",
              fontSize: "1.1rem",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}>
            {car.title || car.name}
          </Typography>

          {/* Description */}
          <Typography
            variant="body2"
            sx={{
              color: "grey.600",
              mb: "12px",
              fontSize: "0.875rem",
            }}>
            {car.title || car.name}
          </Typography>

          {/* Specifications */}
          <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Iconify
                icon="eva:car-outline"
                sx={{ fontSize: 16, color: "grey.500" }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: "grey.600",
                  fontSize: "0.8rem",
                  whiteSpace: "nowrap",
                }}>
                {car.carDetails?.mileage || "N/A"} mi
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Iconify
                icon="eva:droplet-outline"
                sx={{ fontSize: 16, color: "grey.500" }}
              />
              <Typography
                variant="body2"
                sx={{ color: "grey.600", fontSize: "0.8rem" }}>
                {car.carDetails?.fuelType || "N/A"}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Iconify
                icon="eva:settings-outline"
                sx={{ fontSize: 16, color: "grey.500" }}
              />
              <Typography
                variant="body2"
                sx={{ color: "grey.600", fontSize: "0.8rem" }}>
                {car.carDetails?.transmission || "N/A"}
              </Typography>
            </Box>
          </Stack>

          {/* Price and View Details */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: "auto",
            }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "black",
                fontSize: "1rem !important",
              }}>
              PKR {Number(car.price)?.toLocaleString() || "N/A"}
            </Typography>
            <Button
              variant="text"
              endIcon={<Iconify icon="eva:arrow-forward-fill" />}
              sx={{
                color: "#405FF2",
                fontWeight: 500,
                fontSize: "0.875rem",
                textTransform: "none",
                "&:hover": {
                  bgcolor: "rgba(33, 150, 243, 0.1)",
                },
              }}
              onClick={() => router.push(`/cars/${car._id}`)}>
              View Details
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  };

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
    <Box sx={{ bgcolor: "black", py: 6 }}>
      <Container maxWidth="xl">
        <Box sx={{ pb: "28px" }}>
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
                color: "rgba(255,255,255,0.7)",
                fontSize: "1rem",
                fontWeight: 500,
                textTransform: "none",
                minWidth: 100,
                padding: "16px 24px",
                position: "relative",
                "&.Mui-selected": {
                  color: "#4CAF50",
                  fontWeight: 600,
                },
                "&:hover": {
                  color: "#4CAF50",
                  backgroundColor: "rgba(76, 175, 80, 0.05)",
                },
              },
            }}>
            <Tab label="In Stock" />
            <Tab label="New Cars" />
            <Tab label="Used Cars" />
          </Tabs>
        </Box>

        {/* Cars Slider */}
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
                  <CarCard car={filteredCars[0]} />
                </Box>
              </Box>
            ) : (
              // Multiple cars - use slider
              <Slider
                key={`slider-${activeTab}-${filteredCars.length}`}
                ref={sliderRef}
                {...sliderSettings}
                style={{ width: "100%", display: "flex !important" }}>
                {filteredCars.slice(0, 10).map((car) => (
                  <Box key={car._id} sx={{ px: 1, display: "flex !important" }}>
                    <CarCard car={car} />
                  </Box>
                ))}
              </Slider>
            )}

            {/* Custom Navigation Buttons - Bottom Left */}
            {!isSingleCar && (
              <Box
                sx={{
                  position: "absolute",
                  bottom: -20,
                  left: 0,
                  display: "flex",
                  gap: 1,
                  zIndex: 10,
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
        <Box sx={{ width: "100%", display: { md: "block", xs: "none" } }}>
          <Card
            sx={{
              background: "#25D366",
              borderRadius: 3,
              mb: 4,
              height: "100%",
              overflow: "hidden",
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              },
            }}>
            <CardContent
              sx={{
                p: { xs: 4, md: "32px" },
                textAlign: "center",
                position: "relative",
                zIndex: 2,
              }}>
              <Stack direction="row" gap={2} alignItems="center">
                <Box>
                  <img src="/assets/convertable.png" alt="Comic" />
                </Box>

                <Box>
                  <Typography
                    variant="h2"
                    sx={{
                      color: "#000",
                      fontWeight: 700,
                      mb: 2,
                      fontSize: { xs: "2rem", md: "34px !important" },
                      lineHeight: 1.2,
                      whiteSpace: "nowrap",
                    }}>
                    Import Your Dream Car
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      color: "#ffffff",
                      fontSize: "16px !important",
                      mb: 4,
                      fontWeight: 400,
                      opacity: 0.9,
                      maxWidth: 800,
                      mx: "auto",
                      lineHeight: 1.2,
                      textAlign: "center",
                    }}>
                    From luxury brands to your everyday ride, we make importing
                    your dream car a reality. Expert guidance, competitive
                    pricing, and seamless process.
                  </Typography>
                </Box>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={3}
                  justifyContent="center"
                  alignItems="center">
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<WhatsApp sx={{ fontSize: 28 }} />}
                    onClick={() => {
                      const message =
                        "Hi! I'm interested in importing car parts. Can you help me find the parts I need?";
                      const whatsappUrl = `https://wa.me/923263333456?text=${encodeURIComponent(message)}`;
                      window.open(whatsappUrl, "_blank");
                    }}
                    sx={{
                      backgroundColor: "transparent",
                      border: "1px solid #fff",
                      color: "#000",
                      px: 4,
                      py: 2,
                      fontSize: "16px !important",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      borderRadius: "50px",
                      minWidth: 250,
                      whiteSpace: "nowrap",
                    }}>
                    Chat on WhatsApp
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
}
