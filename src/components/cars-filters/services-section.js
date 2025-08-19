"use client";

import React from "react";
import { Box, Typography, Container, Button } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Iconify from "src/components/iconify";

// Custom styles for the slider
const customSliderStyles = {
  ".slick-slide": {
    padding: "0 8px",
  },
  ".slick-dots": {
    bottom: "-40px",
  },
  ".slick-dots li button:before": {
    color: "white",
    opacity: 0.7,
  },
  ".slick-dots li.slick-active button:before": {
    color: "#4CAF50",
  },
  ".slick-prev, .slick-next": {
    display: "none !important",
  },
};

const services = [
  {
    id: 1,
    question: "Car Broke down?",
    title: "Call a Mechanic",
    backgroundImage: "/assets/mechanicService.png",
  },
  {
    id: 2,
    question: "Got into an accident!",
    title: "Towing Service",
    backgroundImage: "/assets/towingService.png",
  },
  {
    id: 3,
    question: "Want a clean car?",
    title: "Car Detailing",
    backgroundImage: "/assets/detailingService.png",
  },
  {
    id: 4,
    question: "Got into an accident!",
    title: "Towing Service",
    backgroundImage: "/assets/towingService.png",
  },
];

export default function ServicesSection() {
  const sliderSettings = {
    dots: true, // Enable built-in dots
    infinite: true,
    speed: 800,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: false,
    arrows: false, // Hide default arrows
    fade: false,
    cssEase: "ease-in-out",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          autoplay: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          autoplay: true,
          dots: true,
        },
      },
    ],
  };

  return (
    <Box sx={{ bgcolor: "black", py: 8 }}>
      <style>
        {`
          .slick-slide {
            padding: 0 8px;
          }
          .slick-dots {
            bottom: -40px;
            position: absolute;
            display: flex !important;
            justify-content: center;
            align-items: center;
            gap: 8px;
          }
          .slick-dots li {
            margin: 0;
          }
          .slick-dots li button {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: white;
            opacity: 0.7;
            border: none;
            padding: 0;
            font-size: 0;
            line-height: 0;
            display: block;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          .slick-dots li.slick-active button {
            background: #4CAF50;
            opacity: 1;
            transform: scale(1.2);
          }
          .slick-dots li button:before {
            display: none;
          }
          .slick-prev, .slick-next {
            display: none !important;
          }
        `}
      </style>
      <Container maxWidth="xl">
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 6,
          }}>
          <Box sx={{ borderBottom: "2px solid #4CAF50", pb: "36px" }}>
            <Typography
              variant="h3"
              sx={{
                color: "#4CAF50",
                fontWeight: "bold",
                fontSize: { xs: "28px", md: "36px" },
                mb: 1,
              }}>
              Services We Offer
            </Typography>
          </Box>
        </Box>

        {/* Services Slider */}
        <Box sx={{ mb: 4 }}>
          <Slider {...sliderSettings}>
            {services.map((service) => (
              <Box key={service.id} sx={{ px: 1 }}>
                <Box
                  sx={{
                    position: "relative",
                    height: 400,
                    borderRadius: "16px",
                    overflow: "hidden",
                    cursor: "pointer",
                    "&:hover": {
                      transform: "scale(1.02)",
                      transition: "transform 0.3s ease",
                    },
                  }}>
                  {/* Background Image */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundImage: `url(${service.backgroundImage})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  />

                  {/* Question Bubble */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 20,
                      left: 20,
                      bgcolor: "#fff",
                      borderRadius: "12px",
                      px: 2,
                      py: 1,
                      backdropFilter: "blur(80px)",
                    }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "black",
                        fontWeight: 600,
                        fontSize: "0.875rem",
                      }}>
                      {service.question}
                    </Typography>
                  </Box>

                  {/* Service Button */}
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 20,
                      left: 20,
                      right: 20,
                    }}>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        bgcolor: "rgba(0, 0, 0, 0.8)",
                        color: "white",
                        borderRadius: "12px",
                        py: 1.5,
                        fontWeight: 600,
                        backdropFilter: "blur(10px)",
                        width: "max-content",
                        "&:hover": {
                          bgcolor: "rgba(0, 0, 0, 0.9)",
                        },
                      }}>
                      {service.title}
                    </Button>
                  </Box>
                </Box>
              </Box>
            ))}
          </Slider>
        </Box>
      </Container>
    </Box>
  );
}
