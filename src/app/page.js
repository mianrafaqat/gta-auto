import React from "react";
import CarsFiltersPage from "src/components/cars-filters";
import LastestEightCars from "src/components/first-eight-cars";
import CustomLayout from "./custom-layout";
import MainLayout from "src/layouts/main";
import { Box } from "@mui/material";

export const metadata = {
  title: "garage tuned autos: Home",
  description: "Your premier destination for automotive products and services",
  verification: {
    google: "wF3dRaXdpca-BY45EI1zQ3un-YW-lLF4nlMmkextMYU",
  },
};


export default function OverviewAppPage() {
  return (
    <CustomLayout>
      <MainLayout>
        <Box sx={{ pt: 6 }}>
          <CarsFiltersPage />
          {/* <LastestEightCars /> */}
        </Box>
      </MainLayout>
    </CustomLayout>
  );
}
