"use client";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  IconButton,
  Stack,
  useMediaQuery,
} from "@mui/material";
import React, { useState, useRef, useEffect } from "react";
import { useGetAllCars } from "src/hooks/use-cars";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Iconify from "src/components/iconify";
import GarageItem from "src/sections/garage/garage-item";
import Image from "next/image";
import Link from "next/link";

export default function CarRentSection() {
  const { data: allCarsData, isLoading, error } = useGetAllCars();
  const sliderRef = useRef(null);
  const isMobile = useMediaQuery("(max-width: 800px)");

  // Filter cars with rent category
  const getRentCars = () => {
    const baseCars = allCarsData?.data || [];

    // Filter by rent category (include all statuses for rental cars)
    const rentCars = baseCars.filter(
      (car) => car.category?.toLowerCase() === "rent"
    );

    return rentCars;
  };

  const rentCars = getRentCars();

  // Calculate slidesToShow based on available cars
  const getSlidesToShow = (defaultValue) => {
    return Math.min(defaultValue, rentCars.length);
  };

  // Check if we have only one car
  const isSingleCar = rentCars.length === 1;

  const sliderSettings = {
    dots: false,
    infinite: rentCars.length > 4,
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
    <Box
      sx={{
        py: {xs: 2, md: 8},
        position: "relative",
        backgroundImage:{xs: "unset", md: "url(/assets/rentcar.webp)"},
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
        <Box
          sx={{
            pb: {xs: 0, md: "28px"},
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
          <Typography
            variant="h3"
            sx={{
              color: "#4CAF50",
              fontWeight: "bold",
              fontSize: { xs: "18px", md: "36px" },
              mb: 1,
              width: "max-content",
            }}>
            Rental
          </Typography>

        
        </Box>
        
        {/* Mobile Slider */}
        {isMobile ? (
          <Box sx={{ position: "relative", mt: 2 }}>
            <Slider
              ref={sliderRef}
              {...{
                ...sliderSettings,
                slidesToShow: 1,
                slidesToScroll: 1,
                infinite: true,
                dots: true,
                arrows: false,
              }}>
              <Box sx={{ px: 1 }}>
                <Link
                  href="/guard"
                  style={{ textDecoration: "none", borderRadius: "10px" }}>
                  <img
                    src="/assets/Security-Guard-3.jpg"
                    alt="Guard Squad"
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "cover",
                      borderRadius: "10px",
                    }}
                  />
                </Link>
              </Box>
              <Box sx={{ px: 1 }}>
                <Link
                  href="/rent"
                  style={{ textDecoration: "none", borderRadius: "10px" }}>
                  <img
                    src="/assets/cars-squad.jpg"
                    alt="Rental Cars"
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "cover",
                      borderRadius: "10px",
                    }}
                  />
                </Link>
              </Box>
            </Slider>
          </Box>
        ) : (
          /* Desktop Layout */
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
              justifyContent: "space-around",
            }}>
            <Box
              sx={{
                width: "50%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}>
              <Link
                href="/guard"
                style={{ textDecoration: "none", borderRadius: "10px" }}>
                <img
                  src="/assets/Security-Guard-3.jpg"
                  alt="rentcar"
                  height={650}
                  ratio="16/9"
                />
              </Link>
              <Box
                sx={{
                  display: "block",
                  backgroundImage: "url(/assets/WhoWeAre.jpeg)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  border: "2px solid #25D366",
                  borderRadius: 4,
                  p: 6,
                  bgcolor: "rgba(37, 211, 102, 0.05)",
                  color: "#fff",
                  position: "relative",
                  mt: 2,
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.4)",
                    borderRadius: 4,
                    zIndex: 1,
                  },
                  "& > *": {
                    position: "relative",
                    zIndex: 2,
                  },
                }}>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#fff",
                    fontSize: { xs: "20px", md: "22px" },
                    textAlign: "center",
                    mt: 2,
                  }}>
                  At Garage Tuned Autos, our GUARD SQUAD provides highly trained
                  and disciplined security professionals dedicated to protecting
                  your assets and ensuring safety around the clock. Whether it's
                  event security, personal protection, or property surveillance,
                  our team delivers reliability, professionalism, and peace of
                  mind — always ready to serve with confidence.
                </Typography>
              </Box>
            </Box>
            <Box sx={{ width: "50%" }}>
              <Link
                href="/rent"
                style={{ textDecoration: "none", borderRadius: "10px" }}>
                <img
                  style={{ borderRadius: "10px" }}
                  src="/assets/cars-squad.jpg"
                  alt="rentcar"
                  height={650}
                  ratio="16/9"
                />
              </Link>
              <Box
                sx={{
                  display: "block",
                  backgroundImage: "url(/assets/WhoWeAre.jpeg)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  border: "2px solid #25D366",
                  borderRadius: 4,
                  p: 6,
                  bgcolor: "rgba(37, 211, 102, 0.05)",
                  color: "#fff",
                  position: "relative",
                  mt: 2,
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.4)",
                    borderRadius: 4,
                    zIndex: 1,
                  },
                  "& > *": {
                    position: "relative",
                    zIndex: 2,
                  },
                }}>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#fff",
                    fontSize: { xs: "20px", md: "22px" },
                    textAlign: "center",
                    mt: 2,
                  }}>
                  Looking for a luxury ride or reliable vehicle for your next
                  trip? Garage Tuned Autos offers premium car rental services
                  featuring a range of SUVs and executive cars maintained to
                  perfection. Enjoy smooth rides, flexible rental plans, and
                  top-tier customer support — because your journey deserves the
                  best experience on every mile.
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
       
      </Container>
    </Box>
  );
}
