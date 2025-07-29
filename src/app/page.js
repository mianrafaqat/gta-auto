import React from "react";
import CarsFiltersPage from "src/components/cars-filters";
import LastestEightCars from "src/components/first-eight-cars";
import CustomLayout from "./custom-layout";
import MainLayout from "src/layouts/main";
import { Box } from "@mui/material";

export const metadata = {
  title: "gtaAutos: Home",
};

export default function OverviewAppPage() {
  return (
    <CustomLayout>
      <MainLayout>
        <Box sx={{ pt: 10 }}>
          <CarsFiltersPage />
          {/* <LastestEightCars /> */}
        </Box>
      </MainLayout>
    </CustomLayout>
  );
}
