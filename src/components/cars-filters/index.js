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

export default function CarsFiltersPage() {
  const { data: carBodyList = [], isLoading: carBodyLoading } = useGetCarBodyList();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [currentSlide, setCurrentSlide] = useState(0);

  // Desktop playback IDs for 2 slides
  const desktopPlaybackIds = [
    "8YObs002Jd4TxxHXlXiw7DXgXkR5OwD7gXixt4AukMUA"
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
      <Container
        sx={{
          borderRadius: "12px",
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          minHeight: 630,
          position: 'relative',
          // overflow: 'hidden',
        }}
        maxWidth="xl"
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0,
            '& > *': {
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }
          }}
        >
          <MuxPlayer
            playbackId={getCurrentPlaybackId()}
            autoPlay
            muted
            controls={false}
            loop
            streamType="on-demand"
            style={{
              height: '100%',
              width: '100vw',
              objectFit: 'cover',
              // borderRadius: '12px',
              '--media-object-fit': 'cover',
              '--media-object-position': 'center',
              '--controls': 'none',
              '--media-control-display': 'none',
              '& mux-player': {
                '--controls': 'none !important',
              },
              pointerEvents: 'none',
            }}
          />
        </Box>

        {/* Slide indicators for desktop */}
        {!isMobile && (
          <Box
            sx={{
              position: 'absolute',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 2,
              display: 'flex',
              gap: 1,
            }}
          >
            {desktopPlaybackIds.map((_, index) => (
              <Box
                key={index}
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: currentSlide === index ? '#fff' : 'rgba(255,255,255,0.5)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </Box>
        )}

        <Box
          sx={{
            position: 'absolute',
            top: '45%',
            left: '60%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1,
            textAlign: 'center',
            // width: '100%'
          }}
        >
          <Box
            component="img"
            src="/assets/logo.webp"
            alt="Logo"
            sx={{
              width: { xs: '200px', sm: '250px', md: '300px' },
              height: 'auto',
              marginBottom: 3
            }}
          />
          <Typography
            variant="h2"
            sx={{
              color: '#fff',
              fontWeight: 700,
              textTransform: 'uppercase',
              animation: 'fadeInOut 2s infinite',
              '@keyframes fadeInOut': {
                '0%': { opacity: 0.4 },
                '50%': { opacity: 1 },
                '100%': { opacity: 0.4 },
              },
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              fontSize: { xs: '2rem', sm: '3rem', md: '4rem' }
            }}
          >
            Coming Soon
          </Typography>
        </Box>
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
            width: "90%",
            background: '#fff',
            boxShadow:
              "rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px",
            position: 'relative',
            zIndex: 1,
            mb: "-50px",
            display: {xs: 'none', md: 'block'}
          }}
        >
          <Box mt={2}>
            <SearchByModels carBodyList={carBodyList} />
          </Box>
        </Box>
      </Container>

      {/* Car Body Types Section */}
      {/* <CarBodyTypesSection  /> */}

      {/* Services Section */}
      <ServicesSection />

      {/* Featured Cars Section */}
      <FeaturedCarsSection />

      {/* Browse Brands Section */}

      {/* Latest Products Section */}
      {/* <LatestProductsSection /> */}

      {/* <BrowseBrandsSection /> */}

      {/* Browse Videos Section */}
      <BrowseVideosSection />

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
