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
  const isMobile = useMediaQuery('(max-width: 800px)');

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
             Rental
          </Typography>
          
          {/* {!isSingleCar && rentCars.length > 0 && (
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
          )} */}
        </Box>
        <Box sx={{ display: "flex", flexDirection:{xs: "column", md: "row"}, gap: 2, justifyContent: "space-around" }}>
         <Box sx={{ width: {sm: "100%", md: "50%"}, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
         <Link href="/guard" style={{ textDecoration: "none" , borderRadius: "10px" }}> 
         <img src="/assets/Security-Guard-3.jpg" alt="rentcar"  height={ isMobile ? 350 : 650} ratio="16/9" />
         </Link>
         <Box sx={{
            display: {xs: "none", md: "block"},
            backgroundImage: 'url(/assets/WhoWeAre.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            border: '2px solid #25D366',
            borderRadius: 4,
            p: 6,
            bgcolor: 'rgba(37, 211, 102, 0.05)',
            color: '#fff',
            position: 'relative',
            mt: 2,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              borderRadius: 4,
              zIndex: 1
            },
            '& > *': {
              position: 'relative',
              zIndex: 2
            }
          }}>
          <Typography variant="h6" sx={{ color: "#fff", fontSize: { xs: "20px", md: "22px" }, textAlign: "center", mt: 2 }}>
          At Garage Tuned Autos, our GUARD SQUAD provides highly trained and disciplined security professionals dedicated to protecting your assets and ensuring safety around the clock. Whether it’s event security, personal protection, or property surveillance, our team delivers reliability, professionalism, and peace of mind — always ready to serve with confidence.
          </Typography>
          </Box>
         </Box>
         <Box sx={{ width: {sm: "100%", md: "50%"} }}>
          <Link href="/rent" style={{ textDecoration: "none" , borderRadius: "10px" }}> 
          <img style={{ borderRadius: "10px" }} src="/assets/cars-squad.jpg" alt="rentcar"  height={ isMobile ? 350 : 650} ratio="16/9" />
          </Link>
          <Box sx={{
            display: {xs: "none", md: "block"},
            backgroundImage: 'url(/assets/WhoWeAre.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            border: '2px solid #25D366',
            borderRadius: 4,
            p: 6,
            bgcolor: 'rgba(37, 211, 102, 0.05)',
            color: '#fff',
            position: 'relative',
            mt: 2,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              borderRadius: 4,
              zIndex: 1
            },
            '& > *': {
              position: 'relative',
              zIndex: 2
            }
          }}>
          <Typography  variant="h6" sx={{  color: "#fff",  fontSize: { xs: "20px", md: "22px" }, textAlign: "center", mt: 2 }}>
          Looking for a luxury ride or reliable vehicle for your next trip? Garage Tuned Autos offers premium car rental services featuring a range of SUVs and executive cars maintained to perfection. Enjoy smooth rides, flexible rental plans, and top-tier customer support — because your journey deserves the best experience on every mile.
          </Typography>
          </Box>
          </Box>
        </Box>  
       {/*   Cars Display 
        {rentCars.length > 0 ? (
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
                  <GarageItem product={rentCars[0]} />
                </Box>
              </Box>
            ) : (
              <>
                {/* Mobile View - Vertical Stack 
                <Box
                  sx={{
                    display: { xs: "block", md: "none" },
                  }}>
                  <Stack spacing={3} alignItems="center">
                    {rentCars.slice(0, 10).map((car) => (
                      <Box
                        key={car._id}
                        sx={{ width: "100%", maxWidth: "400px" }}>
                        <GarageItem product={car} />
                      </Box>
                    ))}
                  </Stack>
                </Box>

                {/* Desktop View - Slider                 <Box
                  sx={{
                    display: { xs: "none", md: "block" },
                  }}>
                  <Slider
                    key={`slider-${rentCars.length}`}
                    ref={sliderRef}
                    {...sliderSettings}
                    style={{ width: "100%", display: "flex !important" }}>
                    {rentCars.slice(0, 10).map((car) => (
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
              No rental cars found
            </Typography>
          </Box>
        )} */}
      </Container>
    </Box>
  );
}
