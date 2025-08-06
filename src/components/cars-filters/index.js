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
  const { data: carBodyList = [], isLoading: carBodyLoading } =
    useGetCarBodyList();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [currentSlide, setCurrentSlide] = useState(0);

  // Desktop playback IDs for 2 slides
  const desktopPlaybackIds = ["8YObs002Jd4TxxHXlXiw7DXgXkR5OwD7gXixt4AukMUA"];

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
      <Hero />

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
