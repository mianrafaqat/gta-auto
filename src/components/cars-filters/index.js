"use client";

import React, { useCallback, useEffect, useState, useMemo } from "react";
import Container from "@mui/material/Container";
import MuxPlayer from "@mux/mux-player-react";
import {
  Autocomplete,
  Box,
  Tab,
  Tabs,
  TextField,
  Stack,
  Button,
  Typography,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
} from "@mui/material";
import Iconify from "../iconify";
import { useRouter } from "next/navigation";
import { paths } from "src/routes/paths";
import ServicesSection from "./services-section";
import FeaturedCarsSection from "./featured-cars";
import SellYourCarSection from "./sell-your-car";
import BrowseVideosSection from "./browse-videos";
import Hero from "./Hero";
import { useGetCarBodyList } from "src/hooks/use-cars";
import SearchByModels from "./search-by-models";
import LatestProductsSection from "./latest-products";
import { WhatsApp } from "@mui/icons-material";
import HeroBottom from "../heroBottom";
import CategoryOffers from "src/sections/categoryOffers";
import CTA from "../cta";
import Discounted from "../discounted";
import CarRentSection from "./car-rent";
import WhoWeAre from "./who-we-are";
import MobileBanner from "./mobile-banner";

export default function CarsFiltersPage() {
  const { data: carBodyList = [], isLoading: carBodyLoading } =
    useGetCarBodyList();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [currentSlide, setCurrentSlide] = useState(0);

  // Desktop playback IDs for 2 slides
  const desktopPlaybackIds = [
    "CR7wgz029UVdMH01e2ZbZG02hSozEYnSNOuF02vEvMtZZ01w",
  ];

  // Mobile playback ID
  const mobilePlaybackId = "gzB22KDrzm1XR4sfmnGnmQ1vF0000yNzo00f02rcNO2VlXg";

  // Auto-advance slides for desktop
  useEffect(() => {
    if (!isMobile) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % desktopPlaybackIds.length);
      }, 5000); // Change slide every 5 seconds

      return () => clearInterval(interval);
    }
  }, [isMobile]);

  const getCurrentPlaybackId = () => {
    if (isMobile) {
      return mobilePlaybackId;
    }
    return desktopPlaybackIds[currentSlide];
  };

  return (
    <>
    <MobileBanner />
      <Hero />
      {/* <Container maxWidth="xl">
      <Box
        p={3}
        sx={{
          zIndex: 999,
          borderRadius: "12px",
          marginBottom: 0,
          maxWidth: {
            sm: "95%",
            md: "80%",
            lg: "100%",
          },
          mt: "50px",
        
          background: "#fff",
          boxShadow:
            "rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px",
          position: "relative",
          zIndex: 1,
          display: { xs: "none", md: "block" },
          height: "210px",
          mb: "50px",
          mx: "auto",
        }}>
        <Box mt={2} >
          <SearchByModels />
        </Box>
      </Box>
      </Container> */}

      <WhoWeAre />

      <Container maxWidth="xl">
        <Box
          sx={{
            width: "100%",
            mt: "56px",
            display: { md: "block", xs: "none" },
          }}>
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
                  <img
                    width={560}
                    style={{ objectFit: "contain" }}
                    src="/assets/bugati.png"
                    alt="Comic"
                  />
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
                    Book an appointment
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Box>

        {/* <Box
          sx={{
            width: "100%",
            mt: "32px",
            display: { md: "block", xs: "none" },
          }}>
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
              <Stack
                direction="row"
                gap={2}
                alignItems="center"
                justifyContent="space-between">
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
                    Import your desire accessories
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
                      maxWidth: 400,
                    }}>
                    From genuine OEM parts to aftermarket upgrades, we source
                    and import quality car parts for all brands.
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
                      const whatsappUrl = `https://wa.me/923263331000?text=${encodeURIComponent(message)}`;
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
                    Book an appointment
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Box>

        <Box
          sx={{
            width: "100%",
            mt: "32px",
            display: { md: "block", xs: "none" },
          }}>
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
                    Rent A Car
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
                    Discover the easiest way to rent a car for your next
                    journey. Choose from a wide range of vehicles at affordable
                    rates and enjoy a smooth, hassle-free experience.
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
                    Book an appointment
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Box> */}
      </Container>

      

      <Stack sx={{flexDirection: {xs: "column-reverse", md: "column"}}}>
        <CarRentSection />
        <Box
          sx={{
            backgroundImage: "url(/assets/serviceBg.webp)",
            backgroundSize: "cover",
            backgroundAttachment: "fixed",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            minHeight: "600px",
          }}>
          <FeaturedCarsSection />
        </Box>
      </Stack>

      {/* <HeroBottom /> */}

      {/* Car Body Types Section */}
      {/* <CarBodyTypesSection  /> */}

      {/* Services Section */}

      {/* Latest Products Section */}
      <Box sx={{}}>
        <LatestProductsSection isShop={false} titleText="Latest Products" />
      </Box>

      <BrowseVideosSection />

      <Container maxWidth="xl">
        <Box
          sx={{
            width: "100%",
            mt: "32px",
            display: { md: "block", xs: "none" },
          }}>
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
              <Stack
                direction="row"
                gap={2}
                alignItems="center"
                justifyContent="space-between">
                <Box>
                  <img
                    width={560}
                    src="/assets/car-accessories-png-car-parts-clipart.png"
                    alt="Comic"
                  />
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
                    Import Your Desire Accessories
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
                      maxWidth: 400,
                    }}>
                    From genuine OEM parts to aftermarket upgrades, we source
                    and import quality car parts for all brands.
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
                      const whatsappUrl = `https://wa.me/923263331000?text=${encodeURIComponent(message)}`;
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
                    Book an appointment
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Container>

      <Box
        sx={{
          pb: { md: 0, xs: 4 },
        }}>
        <LatestProductsSection isShop={true} />
      </Box>

      {/* <CategoryOffers /> */}

      {/* Featured Cars Section */}

      {/* <Discounted /> */}

      {/* Browse Brands Section */}

      {/* <BrowseBrandsSection /> */}

      {/* Browse Videos Section */}

      <ServicesSection />

      {/* <CTA /> */}

      {/* Upcoming Cars And Events Section */}
      {/* <UpcomingCarsSection /> */}
    </>
  );
}

// function SearchByCarBody({ reset = false, carBodyList = [] }) {
//   const [selectedCarBody, setSelectedBody] = useState("");

//   const router = useRouter();

//   useEffect(() => {
//     if (selectedCarBody) {
//       router.push(`${paths.cars.root}?makeType=${selectedCarBody}&tab=two`);
//     }
//   }, [selectedCarBody]);

//   return (
//     <>
//       <Autocomplete
//         fullWidth
//         options={carBodyList}
//         value={selectedCarBody}
//         onChange={(event, newValue) => {
//           setSelectedBody(newValue);
//         }}
//         getOptionLabel={(option) => option}
//         renderInput={(params) => (
//           <TextField {...params} label="Car Body" margin="none" />
//         )}
//         renderOption={(props, option) => (
//           <li {...props} key={option}>
//             {option}
//           </li>
//         )}
//       />
//     </>
//   );
// }
