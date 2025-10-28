import { WhatsApp } from "@mui/icons-material";
import { Box, Button, Stack, Typography } from "@mui/material";
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const MobileBanner = () => {
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  const slides = [
    {
      title: "Import Your Dream Car",
      message:
        "Hi! I'm interested in importing car parts. Can you help me find the parts I need?",
      buttonText: "Book an appointment",
      image: "/assets/bugati.png",
      contactNumber: "923263333456",
    },
    {
      title: "Import Your Desire Accessories",
      message:
        "Hi! I'm interested in importing car parts. Can you help me find the parts I need?",
      buttonText: "Book an appointment",
      image: "/assets/car-accessories-png-car-parts-clipart.png",
      contactNumber: "923263331000",
    },
  ];

  return (
    <Box
      sx={{
        display: { md: "none", xs: "block" },
        bgcolor: "#000",
        p: "12px",
        mt: "24px",
        "& .slick-dots": {
          bottom: "10px",
          "& li button:before": {
            color: "#fff",
            fontSize: "10px",
            opacity: 0.5,
          },
          "& li.slick-active button:before": {
            opacity: 1,
            color: "#fff",
          },
        },
      }}>
      <Slider {...sliderSettings}>
        {slides.map((slide, index) => (
          <Stack direction="row" key={index}>
            <Typography
              variant="h4"
              sx={{
                color: "#fff",
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: "1rem", md: "34px !important" },
                lineHeight: 1.2,
                whiteSpace: "nowrap",
              }}>
              {slide.title}
            </Typography>
            <Stack
              sx={{
                justifyContent: "flex-end",
                alignItems: "flex-end",
                mt: "12px",
              }}>
              <img
                height="150px"
                style={{ objectFit: "contain" }}
                src={slide.image}
                alt={slide.title}
              />
            </Stack>
            <Button
              variant="contained"
              size="large"
              startIcon={<WhatsApp sx={{ fontSize: 28 }} />}
              onClick={() => {
                const whatsappUrl = `https://wa.me/${slide.contactNumber}?text=${encodeURIComponent(slide.message)}`;
                window.open(whatsappUrl, "_blank");
              }}
              sx={{
                backgroundColor: "transparent",
                border: "1px solid #fff",
                color: "#fff",
                px: 2,
                py: 2,
                fontSize: "14px !important",
                fontWeight: 500,
                textTransform: "uppercase",
                borderRadius: "50px",
                whiteSpace: "nowrap",
                mt: "12px",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}>
              {slide.buttonText}
            </Button>
          </Stack>
        ))}
      </Slider>
    </Box>
  );
};

export default MobileBanner;
