import { WhatsApp } from "@mui/icons-material";
import { Box, Button, Stack, Typography } from "@mui/material";
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const MobileBanner = ({ slideIndex = "both" }) => {
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

  const formatTitle = (title) => {
    const words = title.split(" ");
    if (words.length <= 1) return title;

    const accessoriesCard = words.slice(0, 1).join(" ");
    const carCard = words.slice(1).join(" ");

    return (
      <>
        {accessoriesCard}
        <br />
        {carCard}
      </>
    );
  };

  const slides = [
    {
      title: "Import Your Desire Accessories",
      message:
        "Hi! I'm interested in importing car parts. Can you help me find the parts I need?",
      buttonText: "Book an appointment",
      image: "/assets/accessriesImport.png",
      contactNumber: "923263331000",
    },
    {
      title: "Import Your Dream Car",
      message:
        "Hi! I'm interested in importing car parts. Can you help me find the parts I need?",
      buttonText: "Book an appointment",
      image: "/assets/mobileImportSLider.png",
      contactNumber: "923263333456",
    },
  ];

  // Filter slides based on slideIndex prop
  const getFilteredSlides = () => {
    if (slideIndex === "both") return slides;
    if (slideIndex === 0 || slideIndex === "accessories") return [slides[0]];
    if (slideIndex === 1 || slideIndex === "car") return [slides[1]];
    return slides;
  };

  const filteredSlides = getFilteredSlides();

  return (
    <Box
      sx={{
        display: { md: "none", xs: "flex" },
        bgcolor: "#000",
        flexDirection: "column",
        alignItems: "flex-start",
        mb: 1.5,
        gap: 1.5,
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
      {filteredSlides.map((slide, index) => (
        <Stack
          className="mobile-banner-slider"
          direction="column"
          alignItems="flex-start"
          justifyContent="flex-start"
          width="100%"
          key={index}
          onClick={() => {
            const whatsappUrl = `https://wa.me/${slide.contactNumber}?text=${encodeURIComponent(slide.message)}`;
            window.open(whatsappUrl, "_blank");
          }}
          sx={{
            flex: 1,
            background: `linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.3)), url(${slide.image}) no-repeat center center`,
            backgroundSize: "cover",
            borderRadius: "12px",
            border: "2px solid #25D366",
            overflow: "hidden",
            p: 2,
            pb: 1,
            minHeight: "150px",

            justifyContent: "flex-start",
            cursor: "pointer",
            transition: "transform 0.2s ease-in-out",
            "&:hover": {
              transform: "scale(1.02)",
            },
          }}>
          <Typography
            variant="h4"
            sx={{
              color: "#fff",
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: "1rem", md: "34px !important" },
              lineHeight: 1.2,
            }}>
            {formatTitle(slide.title)}
          </Typography>

          <Button
            variant="contained"
            size="large"
            startIcon={<WhatsApp sx={{ fontSize: 24 }} />}
            sx={{
              backgroundColor: "transparent",
              color: "#25D366",
              px: 1,
              py: 1,
              fontSize: "12px !important",
              fontWeight: 900,
              textTransform: "uppercase",
              borderRadius: "50px",
              whiteSpace: "nowrap",
              mt: "12px",
              pointerEvents: "none",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}>
            {slide.buttonText}
          </Button>
        </Stack>
      ))}
    </Box>
  );
};

export default MobileBanner;
