"use client";

import React, { useEffect, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import { paths } from "src/routes/paths";
import ServicesSection from "./services-section";
import FeaturedCarsSection from "./featured-cars";
import SellYourCarSection from "./sell-your-car";
import BrowseVideosSection from "./browse-videos";
import Hero from "./Hero";

export default function CarsFiltersPage() {
  return (
    <>
      <Hero />

      {/* Sell Your Car Section */}
      <SellYourCarSection />

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
